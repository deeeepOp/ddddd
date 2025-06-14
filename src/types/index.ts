export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects: string[];
  interactions: string[];
  category: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  address: string;
  phone: string;
  availability: string;
  latitude: number;
  longitude: number;
}

export interface PrescriptionData {
  id: string;
  originalText: string;
  extractedText: string;
  medicines: Medicine[];
  diagnoses: Diagnosis[];
  doctorNotes: string;
  uploadedAt: string;
  processingStatus: 'uploading' | 'processing' | 'completed' | 'error';
}