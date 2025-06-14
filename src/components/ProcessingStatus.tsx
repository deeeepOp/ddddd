import React from 'react';
import { Loader2, FileText, Brain, Pill, MapPin } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const steps = [
    { id: 'upload', label: 'Uploading File', icon: FileText },
    { id: 'ocr', label: 'Text Extraction (OCR)', icon: FileText },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'medicines', label: 'Medicine Lookup', icon: Pill },
    { id: 'doctors', label: 'Finding Doctors', icon: MapPin },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (status === 'error') return 'error';
    if (status === 'completed') return 'completed';
    if (status === 'processing' && stepIndex <= 2) return 'processing';
    if (status === 'uploading' && stepIndex === 0) return 'processing';
    return 'waiting';
  };

  if (status === 'completed') return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Prescription</h3>
        <p className="text-gray-600">Please wait while we analyze your prescription...</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const Icon = step.icon;

          return (
            <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              stepStatus === 'processing' ? 'bg-blue-50 border border-blue-200' :
              stepStatus === 'completed' ? 'bg-green-50 border border-green-200' :
              stepStatus === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-gray-50'
            }`}>
              <div className={`flex-shrink-0 ${
                stepStatus === 'processing' ? 'text-blue-600' :
                stepStatus === 'completed' ? 'text-green-600' :
                stepStatus === 'error' ? 'text-red-600' :
                'text-gray-400'
              }`}>
                {stepStatus === 'processing' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              
              <span className={`font-medium ${
                stepStatus === 'processing' ? 'text-blue-900' :
                stepStatus === 'completed' ? 'text-green-900' :
                stepStatus === 'error' ? 'text-red-900' :
                'text-gray-500'
              }`}>
                {step.label}
              </span>

              {stepStatus === 'processing' && (
                <div className="flex-1">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStatus;