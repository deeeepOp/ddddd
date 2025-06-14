import express from 'express';
import { db } from '../database/init.js';
import { generateDiagnosis } from '../services/diagnosisService.js';

const router = express.Router();

// Get diagnosis by prescription ID
router.get('/prescription/:prescriptionId', async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const diagnoses = await db.allAsync(`
      SELECT * FROM diagnoses WHERE prescription_id = ?
      ORDER BY confidence DESC
    `, [prescriptionId]);

    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      ...diagnosis,
      recommendations: diagnosis.recommendations ? JSON.parse(diagnosis.recommendations) : []
    }));

    res.json(formattedDiagnoses);
  } catch (error) {
    console.error('Get diagnosis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate new diagnosis based on symptoms/text
router.post('/generate', async (req, res) => {
  try {
    const { text, medicines = [] } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required for diagnosis' });
    }

    const diagnoses = await generateDiagnosis(text, medicines);
    
    res.json(diagnoses);
  } catch (error) {
    console.error('Generate diagnosis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all diagnoses
router.get('/', async (req, res) => {
  try {
    const diagnoses = await db.allAsync(`
      SELECT d.*, p.original_filename
      FROM diagnoses d
      LEFT JOIN prescriptions p ON d.prescription_id = p.id
      ORDER BY d.created_at DESC
    `);

    const formattedDiagnoses = diagnoses.map(diagnosis => ({
      ...diagnosis,
      recommendations: diagnosis.recommendations ? JSON.parse(diagnosis.recommendations) : []
    }));

    res.json(formattedDiagnoses);
  } catch (error) {
    console.error('Get all diagnoses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;