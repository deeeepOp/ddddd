import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { processImage, processPDF } from '../services/ocrService.js';
import { extractMedicineInfo } from '../services/nlpService.js';
import { generateDiagnosis } from '../services/diagnosisService.js';

const router = express.Router();

// Upload and process prescription
router.post('/upload', async (req, res) => {
  try {
    const upload = req.app.locals.upload;
    
    upload.single('prescription')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const prescriptionId = uuidv4();
      
      try {
        // Save prescription record to database
        await db.runAsync(`
          INSERT INTO prescriptions (id, original_filename, file_path, status)
          VALUES (?, ?, ?, ?)
        `, [prescriptionId, req.file.originalname, req.file.path, 'uploaded']);

        // Start processing in background
        processPrescritionAsync(prescriptionId, req.file);

        res.json({
          id: prescriptionId,
          status: 'uploaded',
          message: 'File uploaded successfully, processing started'
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ error: 'Failed to save prescription record' });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get prescription status and results
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const prescription = await db.getAsync(`
      SELECT * FROM prescriptions WHERE id = ?
    `, [id]);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    let processedData = null;
    if (prescription.processed_data) {
      processedData = JSON.parse(prescription.processed_data);
    }

    // Get associated diagnoses
    const diagnoses = await db.allAsync(`
      SELECT * FROM diagnoses WHERE prescription_id = ?
    `, [id]);

    res.json({
      id: prescription.id,
      originalFilename: prescription.original_filename,
      extractedText: prescription.extracted_text,
      status: prescription.status,
      processedData,
      diagnoses: diagnoses.map(d => ({
        ...d,
        recommendations: d.recommendations ? JSON.parse(d.recommendations) : []
      })),
      createdAt: prescription.created_at,
      updatedAt: prescription.updated_at
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await db.allAsync(`
      SELECT id, original_filename, status, created_at, updated_at
      FROM prescriptions
      ORDER BY created_at DESC
    `);

    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Background processing function
async function processPrescritionAsync(prescriptionId, file) {
  try {
    // Update status to processing
    await db.runAsync(`
      UPDATE prescriptions SET status = 'processing', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [prescriptionId]);

    // Step 1: OCR Processing
    let extractedText = '';
    if (file.mimetype === 'application/pdf') {
      extractedText = await processPDF(file.path);
    } else {
      extractedText = await processImage(file.path);
    }

    // Update with extracted text
    await db.runAsync(`
      UPDATE prescriptions SET extracted_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [extractedText, prescriptionId]);

    // Step 2: NLP Processing
    const medicineInfo = await extractMedicineInfo(extractedText);
    
    // Step 3: Generate AI Diagnosis
    const diagnoses = await generateDiagnosis(extractedText, medicineInfo);
    
    // Save diagnoses to database
    for (const diagnosis of diagnoses) {
      const diagnosisId = uuidv4();
      await db.runAsync(`
        INSERT INTO diagnoses (id, prescription_id, condition_name, confidence, description, severity, recommendations)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        diagnosisId,
        prescriptionId,
        diagnosis.condition,
        diagnosis.confidence,
        diagnosis.description,
        diagnosis.severity,
        JSON.stringify(diagnosis.recommendations)
      ]);
    }

    // Update final status
    await db.runAsync(`
      UPDATE prescriptions SET 
        status = 'completed',
        processed_data = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [JSON.stringify(medicineInfo), prescriptionId]);

  } catch (error) {
    console.error('Processing error:', error);
    
    // Update status to error
    await db.runAsync(`
      UPDATE prescriptions SET status = 'error', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [prescriptionId]);
  }
}

export default router;