import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'prescription_assistant.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export async function initializeDatabase() {
  try {
    // Create prescriptions table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        original_filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        extracted_text TEXT,
        processed_data TEXT,
        status TEXT DEFAULT 'uploaded',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create medicines table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS medicines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        generic_name TEXT,
        category TEXT,
        description TEXT,
        side_effects TEXT,
        interactions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create doctors table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        rating REAL DEFAULT 0,
        address TEXT,
        phone TEXT,
        latitude REAL,
        longitude REAL,
        availability TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create diagnoses table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id TEXT PRIMARY KEY,
        prescription_id TEXT,
        condition_name TEXT NOT NULL,
        confidence REAL DEFAULT 0,
        description TEXT,
        severity TEXT DEFAULT 'low',
        recommendations TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (prescription_id) REFERENCES prescriptions (id)
      )
    `);

    // Insert sample data
    await insertSampleData();
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function insertSampleData() {
  // Insert sample medicines
  const medicines = [
    {
      id: 'med-1',
      name: 'Amoxicillin',
      generic_name: 'Amoxicillin Trihydrate',
      category: 'Antibiotic',
      description: 'Penicillin antibiotic used to treat bacterial infections',
      side_effects: JSON.stringify(['Nausea', 'Diarrhea', 'Stomach pain', 'Headache']),
      interactions: JSON.stringify(['Warfarin', 'Methotrexate', 'Allopurinol'])
    },
    {
      id: 'med-2',
      name: 'Ibuprofen',
      generic_name: 'Ibuprofen',
      category: 'NSAID',
      description: 'Nonsteroidal anti-inflammatory drug for pain and inflammation',
      side_effects: JSON.stringify(['Stomach upset', 'Dizziness', 'Heartburn']),
      interactions: JSON.stringify(['Aspirin', 'Warfarin', 'ACE inhibitors'])
    },
    {
      id: 'med-3',
      name: 'Vitamin D3',
      generic_name: 'Cholecalciferol',
      category: 'Vitamin',
      description: 'Essential vitamin for bone health and immune function',
      side_effects: JSON.stringify(['Rare at recommended doses']),
      interactions: JSON.stringify(['Thiazide diuretics', 'Digoxin'])
    }
  ];

  for (const medicine of medicines) {
    try {
      await db.runAsync(`
        INSERT OR IGNORE INTO medicines (id, name, generic_name, category, description, side_effects, interactions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [medicine.id, medicine.name, medicine.generic_name, medicine.category, medicine.description, medicine.side_effects, medicine.interactions]);
    } catch (error) {
      console.log('Medicine already exists:', medicine.name);
    }
  }

  // Insert sample doctors
  const doctors = [
    {
      id: 'doc-1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      rating: 4.8,
      address: '123 Medical Center Dr, Suite 200',
      phone: '(555) 123-4567',
      latitude: 40.7128,
      longitude: -74.0060,
      availability: 'Available today at 2:30 PM'
    },
    {
      id: 'doc-2',
      name: 'Dr. Michael Chen',
      specialty: 'Family Medicine',
      rating: 4.9,
      address: '456 Health Plaza, Building A',
      phone: '(555) 987-6543',
      latitude: 40.7580,
      longitude: -73.9855,
      availability: 'Next available: Tomorrow 9:00 AM'
    },
    {
      id: 'doc-3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Internal Medicine',
      rating: 4.7,
      address: '789 Wellness Blvd, Floor 3',
      phone: '(555) 456-7890',
      latitude: 40.7829,
      longitude: -73.9654,
      availability: 'Available today at 4:15 PM'
    }
  ];

  for (const doctor of doctors) {
    try {
      await db.runAsync(`
        INSERT OR IGNORE INTO doctors (id, name, specialty, rating, address, phone, latitude, longitude, availability)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [doctor.id, doctor.name, doctor.specialty, doctor.rating, doctor.address, doctor.phone, doctor.latitude, doctor.longitude, doctor.availability]);
    } catch (error) {
      console.log('Doctor already exists:', doctor.name);
    }
  }
}

export { db };