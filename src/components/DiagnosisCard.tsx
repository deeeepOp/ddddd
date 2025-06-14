import React from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Diagnosis } from '../types';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
}

const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertCircle;
      case 'medium': return TrendingUp;
      case 'low': return CheckCircle;
      default: return Brain;
    }
  };

  const SeverityIcon = getSeverityIcon(diagnosis.severity);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{diagnosis.condition}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Confidence:</span>
              <div className="flex items-center space-x-1">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${diagnosis.confidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-purple-600">{diagnosis.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(diagnosis.severity)}`}>
          <SeverityIcon className="h-3 w-3" />
          <span className="capitalize">{diagnosis.severity}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{diagnosis.description}</p>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
        <ul className="space-y-1">
          {diagnosis.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiagnosisCard;