import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Doctor } from '../types';

interface MapViewProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const MapView: React.FC<MapViewProps> = ({ doctors, selectedDoctor, onSelectDoctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Nearby Doctors</h3>
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <Navigation className="h-4 w-4" />
            <span>Get Directions</span>
          </button>
        </div>
      </div>

      {/* Simulated Map View */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Doctor Markers */}
        {doctors.map((doctor, index) => (
          <div
            key={doctor.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
              selectedDoctor?.id === doctor.id ? 'z-20 scale-110' : 'z-10'
            }`}
            style={{
              left: `${20 + (index * 15) + (index % 3) * 10}%`,
              top: `${30 + (index * 8) + (index % 2) * 15}%`,
            }}
            onClick={() => onSelectDoctor(doctor)}
          >
            <div className={`relative ${
              selectedDoctor?.id === doctor.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
            } rounded-full p-3 border-2 border-white`}>
              <MapPin className="h-5 w-5" />
            </div>
            
            {selectedDoctor?.id === doctor.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 min-w-48 border border-gray-200">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{doctor.name}</p>
                  <p className="text-blue-600">{doctor.specialty}</p>
                  <p className="text-gray-500 text-xs mt-1">{doctor.distance} away</p>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
              </div>
            )}
          </div>
        ))}

        {/* User Location */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-red-500 rounded-full p-2 shadow-lg border-2 border-white">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
            You are here
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{doctors.length} doctors found nearby</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span>Doctors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;