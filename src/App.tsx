import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import MedicineCard from './components/MedicineCard';
import DiagnosisCard from './components/DiagnosisCard';
import DoctorCard from './components/DoctorCard';
import MapView from './components/MapView';
import { PrescriptionData, Doctor } from './types';
import { apiService } from './services/api';
import { FileText, Brain, Pill, MapPin, AlertCircle } from 'lucide-react';

function App() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'medicines' | 'diagnoses' | 'doctors'>('medicines');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);

  // Load doctors and medicines on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll for prescription updates when processing
  useEffect(() => {
    if (prescriptionData && prescriptionData.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const updated = await apiService.getPrescription(prescriptionData.id);
          setPrescriptionData(updated);
          
          if (updated.status === 'completed' || updated.status === 'error') {
            clearInterval(interval);
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error polling prescription status:', error);
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [prescriptionData]);

  const loadInitialData = async () => {
    try {
      const [doctorsData, medicinesData] = await Promise.all([
        apiService.getDoctors(),
        apiService.getMedicines()
      ]);
      
      setDoctors(doctorsData);
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    
    try {
      const response = await apiService.uploadPrescription(file);
      
      // Start polling for updates
      const prescription = await apiService.getPrescription(response.id);
      setPrescriptionData(prescription);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setIsProcessing(false);
    }
  };

  const getDisplayMedicines = () => {
    if (prescriptionData?.processedData?.medicines) {
      return prescriptionData.processedData.medicines;
    }
    return medicines.slice(0, 3); // Show sample medicines
  };

  const getDisplayDiagnoses = () => {
    if (prescriptionData?.diagnoses) {
      return prescriptionData.diagnoses;
    }
    return []; // No diagnoses until processing is complete
  };

  const tabs = [
    { id: 'medicines', label: 'Medicines', icon: Pill, count: getDisplayMedicines().length },
    { id: 'diagnoses', label: 'AI Analysis', icon: Brain, count: getDisplayDiagnoses().length },
    { id: 'doctors', label: 'Find Doctors', icon: MapPin, count: doctors.length },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Upload Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!prescriptionData ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          </div>
        ) : prescriptionData.status === 'processing' || isProcessing ? (
          <div className="max-w-2xl mx-auto">
            <ProcessingStatus status={prescriptionData.status} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Analysis Complete</h2>
                  <p className="text-gray-600">Your prescription has been successfully analyzed</p>
                </div>
              </div>
              
              {prescriptionData.extractedText && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Text:</h3>
                  <p className="text-sm text-gray-900 font-mono">{prescriptionData.extractedText}</p>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'medicines' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {prescriptionData.processedData ? 'Extracted Medicines' : 'Sample Medicines'}
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {getDisplayMedicines().map((medicine) => (
                          <MedicineCard key={medicine.id} medicine={medicine} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'diagnoses' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Diagnosis Analysis</h3>
                      {getDisplayDiagnoses().length > 0 ? (
                        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
                          {getDisplayDiagnoses().map((diagnosis) => (
                            <DiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No diagnosis available yet. Upload a prescription to get AI analysis.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'doctors' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Healthcare Providers</h3>
                    
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <MapView
                          doctors={doctors}
                          selectedDoctor={selectedDoctor}
                          onSelectDoctor={setSelectedDoctor}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        {doctors.map((doctor) => (
                          <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onSelectDoctor={setSelectedDoctor}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;