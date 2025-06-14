import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Prescription</h2>
        <p className="text-gray-600">Upload an image or PDF of your prescription for AI analysis</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isProcessing ? 'Processing...' : 'Drop your prescription here'}
            </p>
            <p className="text-gray-500 mb-4">or click to browse files</p>
          </div>

          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Images (JPG, PNG)</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>PDF Documents</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Important Disclaimer</p>
            <p className="text-amber-700">
              This tool is for informational purposes only and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;