import React from 'react';
import { Pill, AlertTriangle, Clock, Info } from 'lucide-react';
import { Medicine } from '../types';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Pill className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
            <p className="text-sm text-gray-500">{medicine.genericName}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          medicine.category === 'Antibiotic' ? 'bg-red-100 text-red-800' :
          medicine.category === 'Pain Relief' ? 'bg-blue-100 text-blue-800' :
          medicine.category === 'Vitamin' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {medicine.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Pill className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Dosage</span>
          </div>
          <p className="text-sm text-gray-900">{medicine.dosage}</p>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Frequency</span>
          </div>
          <p className="text-sm text-gray-900">{medicine.frequency}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Instructions</span>
        </div>
        <p className="text-sm text-gray-600">{medicine.instructions}</p>
      </div>

      {medicine.sideEffects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Common Side Effects</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {medicine.sideEffects.slice(0, 3).map((effect, index) => (
              <span key={index} className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs">
                {effect}
              </span>
            ))}
            {medicine.sideEffects.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                +{medicine.sideEffects.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {medicine.interactions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Drug Interactions</span>
          </div>
          <p className="text-sm text-red-700">
            May interact with: {medicine.interactions.slice(0, 2).join(', ')}
            {medicine.interactions.length > 2 && ` and ${medicine.interactions.length - 2} others`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineCard;