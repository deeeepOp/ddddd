import Tesseract from 'tesseract.js';
import fs from 'fs/promises';
import sharp from 'sharp';

export async function processImage(imagePath) {
  try {
    console.log('Starting OCR processing for image:', imagePath);
    
    // Preprocess image for better OCR results
    const processedImagePath = imagePath + '_processed.jpg';
    await sharp(imagePath)
      .resize(2000, null, { withoutEnlargement: true })
      .sharpen()
      .normalize()
      .jpeg({ quality: 95 })
      .toFile(processedImagePath);

    // Perform OCR
    const { data: { text } } = await Tesseract.recognize(processedImagePath, 'eng', {
      logger: m => console.log('OCR Progress:', m)
    });

    // Clean up processed image
    try {
      await fs.unlink(processedImagePath);
    } catch (error) {
      console.log('Could not delete processed image:', error.message);
    }

    console.log('OCR completed successfully');
    return cleanExtractedText(text);
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to extract text from image');
  }
}

export async function processPDF(pdfPath) {
  try {
    console.log('Starting PDF text extraction:', pdfPath);
    
    // For now, return a mock extracted text for PDFs
    // In production, you would use a proper PDF parsing library
    const mockPdfText = `
      Patient: John Doe
      Date: ${new Date().toLocaleDateString()}
      
      Prescription:
      1. Amoxicillin 500mg - Take 3 times daily for 7 days
      2. Ibuprofen 400mg - Take as needed for pain
      3. Vitamin D3 1000 IU - Take once daily
      
      Instructions: Take medications as prescribed. Complete antibiotic course.
      Follow up in 1 week if symptoms persist.
    `;
    
    console.log('PDF text extraction completed (mock data)');
    return cleanExtractedText(mockPdfText);
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

function cleanExtractedText(text) {
  // Clean and normalize extracted text
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/[^\w\s\-.,():]/g, '') // Remove special characters except common punctuation
    .trim();
}