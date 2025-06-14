import express from 'express';
import { db } from '../database/init.js';
import { getMedicineDetails } from '../services/medicineService.js';

const router = express.Router();

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await db.allAsync(`
      SELECT * FROM medicines ORDER BY name
    `);

    const formattedMedicines = medicines.map(medicine => ({
      ...medicine,
      side_effects: medicine.side_effects ? JSON.parse(medicine.side_effects) : [],
      interactions: medicine.interactions ? JSON.parse(medicine.interactions) : []
    }));

    res.json(formattedMedicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await db.getAsync(`
      SELECT * FROM medicines WHERE id = ?
    `, [id]);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    const formattedMedicine = {
      ...medicine,
      side_effects: medicine.side_effects ? JSON.parse(medicine.side_effects) : [],
      interactions: medicine.interactions ? JSON.parse(medicine.interactions) : []
    };

    res.json(formattedMedicine);
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search medicines by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const medicines = await db.allAsync(`
      SELECT * FROM medicines 
      WHERE name LIKE ? OR generic_name LIKE ?
      ORDER BY name
    `, [`%${query}%`, `%${query}%`]);

    const formattedMedicines = medicines.map(medicine => ({
      ...medicine,
      side_effects: medicine.side_effects ? JSON.parse(medicine.side_effects) : [],
      interactions: medicine.interactions ? JSON.parse(medicine.interactions) : []
    }));

    res.json(formattedMedicines);
  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get detailed medicine information (with external API integration)
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await db.getAsync(`
      SELECT * FROM medicines WHERE id = ?
    `, [id]);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Get additional details from external APIs
    const detailedInfo = await getMedicineDetails(medicine.name);
    
    const response = {
      ...medicine,
      side_effects: medicine.side_effects ? JSON.parse(medicine.side_effects) : [],
      interactions: medicine.interactions ? JSON.parse(medicine.interactions) : [],
      ...detailedInfo
    };

    res.json(response);
  } catch (error) {
    console.error('Get medicine details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;