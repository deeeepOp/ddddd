import { Medicine, Diagnosis, Doctor } from '../types';

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    dosage: '500mg',
    frequency: '3 times daily',
    duration: '7 days',
    instructions: 'Take with food to reduce stomach upset. Complete the full course even if feeling better.',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach pain', 'Headache'],
    interactions: ['Warfarin', 'Methotrexate', 'Allopurinol'],
    category: 'Antibiotic'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'Every 6-8 hours as needed',
    duration: 'As needed',
    instructions: 'Take with food or milk. Do not exceed 1200mg in 24 hours.',
    sideEffects: ['Stomach upset', 'Dizziness', 'Heartburn'],
    interactions: ['Aspirin', 'Warfarin', 'ACE inhibitors'],
    category: 'Pain Relief'
  },
  {
    id: '3',
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    dosage: '1000 IU',
    frequency: 'Once daily',
    duration: 'Ongoing',
    instructions: 'Take with a meal containing fat for better absorption.',
    sideEffects: ['Rare at recommended doses'],
    interactions: ['Thiazide diuretics', 'Digoxin'],
    category: 'Vitamin'
  }
];

export const mockDiagnoses: Diagnosis[] = [
  {
    id: '1',
    condition: 'Bacterial Respiratory Infection',
    confidence: 85,
    description: 'Based on the prescribed antibiotics and symptoms, this appears to be a bacterial respiratory tract infection requiring antibiotic treatment.',
    severity: 'medium',
    recommendations: [
      'Complete the full course of antibiotics',
      'Rest and stay hydrated',
      'Monitor symptoms and fever',
      'Follow up if symptoms worsen'
    ]
  },
  {
    id: '2',
    condition: 'Inflammatory Pain',
    confidence: 75,
    description: 'The prescription of anti-inflammatory medication suggests inflammation-related pain that requires NSAID treatment.',
    severity: 'low',
    recommendations: [
      'Take medication with food',
      'Apply ice or heat as appropriate',
      'Avoid overexertion',
      'Monitor for side effects'
    ]
  },
  {
    id: '3',
    condition: 'Vitamin D Deficiency',
    confidence: 70,
    description: 'Vitamin D supplementation indicates deficiency that needs to be addressed for bone health and immune function.',
    severity: 'low',
    recommendations: [
      'Take supplement consistently',
      'Increase sun exposure safely',
      'Include vitamin D rich foods',
      'Follow up with blood tests'
    ]
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Internal Medicine',
    rating: 4.8,
    distance: '0.5 miles',
    address: '123 Medical Center Dr, Suite 200',
    phone: '(555) 123-4567',
    availability: 'Available today at 2:30 PM',
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Family Medicine',
    rating: 4.9,
    distance: '0.8 miles',
    address: '456 Health Plaza, Building A',
    phone: '(555) 987-6543',
    availability: 'Next available: Tomorrow 9:00 AM',
    latitude: 40.7580,
    longitude: -73.9855
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Internal Medicine',
    rating: 4.7,
    distance: '1.2 miles',
    address: '789 Wellness Blvd, Floor 3',
    phone: '(555) 456-7890',
    availability: 'Available today at 4:15 PM',
    latitude: 40.7829,
    longitude: -73.9654
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    specialty: 'Infectious Disease',
    rating: 4.9,
    distance: '1.5 miles',
    address: '321 Specialist Center, Suite 150',
    phone: '(555) 321-0987',
    availability: 'Next available: Friday 10:30 AM',
    latitude: 40.7505,
    longitude: -73.9934
  }
];