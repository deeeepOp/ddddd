import express from 'express';
import { db } from '../database/init.js';
import { findNearbyDoctors } from '../services/locationService.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await db.allAsync(`
      SELECT * FROM doctors ORDER BY rating DESC
    `);

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get doctors by specialty
router.get('/specialty/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    
    const doctors = await db.allAsync(`
      SELECT * FROM doctors 
      WHERE specialty LIKE ?
      ORDER BY rating DESC
    `, [`%${specialty}%`]);

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors by specialty error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find nearby doctors based on location
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    // Get all doctors and calculate distances
    const allDoctors = await db.allAsync(`
      SELECT * FROM doctors
    `);

    const nearbyDoctors = findNearbyDoctors(allDoctors, latitude, longitude, searchRadius);
    
    res.json(nearbyDoctors);
  } catch (error) {
    console.error('Find nearby doctors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await db.getAsync(`
      SELECT * FROM doctors WHERE id = ?
    `, [id]);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search doctors by name or specialty
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const doctors = await db.allAsync(`
      SELECT * FROM doctors 
      WHERE name LIKE ? OR specialty LIKE ?
      ORDER BY rating DESC
    `, [`%${query}%`, `%${query}%`]);

    res.json(doctors);
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;