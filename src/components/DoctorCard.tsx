import React from 'react';
import { MapPin, Phone, Star, Clock } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelectDoctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => onSelectDoctor(doctor)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">{doctor.address}</p>
            <p className="text-xs text-green-600 font-medium">{doctor.distance} away</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{doctor.phone}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{doctor.availability}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;