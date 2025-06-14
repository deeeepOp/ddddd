const API_BASE_URL = 'http://localhost:3001/api';

export interface UploadResponse {
  id: string;
  status: string;
  message: string;
}

export interface PrescriptionData {
  id: string;
  originalFilename: string;
  extractedText: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  processedData?: {
    medicines: any[];
    dosages: string[];
    frequencies: string[];
    medicalTerms: string[];
  };
  diagnoses: any[];
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  async uploadPrescription(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('prescription', file);

    const response = await fetch(`${API_BASE_URL}/prescriptions/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async getPrescription(id: string): Promise<PrescriptionData> {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch prescription');
    }

    return response.json();
  }

  async getAllPrescriptions(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/prescriptions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.json();
  }

  async getMedicines(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/medicines`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch medicines');
    }

    return response.json();
  }

  async getMedicine(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch medicine details');
    }

    return response.json();
  }

  async searchMedicines(query: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/medicines/search/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search medicines');
    }

    return response.json();
  }

  async getDoctors(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }

    return response.json();
  }

  async getNearbyDoctors(lat: number, lng: number, radius: number = 10): Promise<any[]> {
    const response = await fetch(
      `${API_BASE_URL}/doctors/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch nearby doctors');
    }

    return response.json();
  }

  async getDoctorsBySpecialty(specialty: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/doctors/specialty/${encodeURIComponent(specialty)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch doctors by specialty');
    }

    return response.json();
  }

  async generateDiagnosis(text: string, medicines: any[] = []): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/diagnosis/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, medicines }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate diagnosis');
    }

    return response.json();
  }

  async getDiagnosesByPrescription(prescriptionId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/diagnosis/prescription/${prescriptionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch diagnoses');
    }

    return response.json();
  }
}

export const apiService = new ApiService();