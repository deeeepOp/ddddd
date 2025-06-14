# AI Prescription Assistant

A comprehensive full-stack web application that uses AI to analyze prescription images and PDFs, extract medicine information, provide diagnosis insights, and help users find nearby healthcare providers.

## Features

### Frontend (React + TypeScript)
- **File Upload Interface**: Drag-and-drop support for images (JPG, PNG) and PDF files
- **Real-time Processing**: Live status updates during OCR and AI analysis
- **Medicine Information**: Detailed cards showing dosage, side effects, and interactions
- **AI Diagnosis**: Machine learning-based condition analysis with confidence scores
- **Doctor Finder**: Interactive map showing nearby healthcare providers
- **Responsive Design**: Optimized for desktop and mobile devices

### Backend (Node.js + Express)
- **OCR Processing**: Tesseract.js for image text extraction and PDF parsing
- **NLP Analysis**: Natural language processing to extract medicine names, dosages, and frequencies
- **AI Diagnosis**: Pattern-matching algorithm for condition identification
- **SQLite Database**: Stores prescriptions, medicines, doctors, and diagnoses
- **RESTful API**: Comprehensive endpoints for all functionality
- **File Management**: Secure file upload and storage system

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Node.js with Express
- SQLite3 for database
- Tesseract.js for OCR
- Natural.js for NLP processing
- Multer for file uploads
- Sharp for image processing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only  
npm run client
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## API Endpoints

### Prescriptions
- `POST /api/prescriptions/upload` - Upload prescription file
- `GET /api/prescriptions/:id` - Get prescription details
- `GET /api/prescriptions` - Get all prescriptions

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get specific medicine
- `GET /api/medicines/search/:query` - Search medicines
- `GET /api/medicines/:id/details` - Get detailed medicine info

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/nearby` - Find nearby doctors (requires lat/lng)
- `GET /api/doctors/specialty/:specialty` - Get doctors by specialty
- `GET /api/doctors/:id` - Get specific doctor

### Diagnosis
- `POST /api/diagnosis/generate` - Generate AI diagnosis
- `GET /api/diagnosis/prescription/:id` - Get diagnoses for prescription

## How It Works

### 1. File Upload
Users can upload prescription images or PDFs through the intuitive drag-and-drop interface.

### 2. OCR Processing
- Images are preprocessed using Sharp for better OCR accuracy
- Tesseract.js extracts text from images
- PDF-parse extracts text from PDF documents

### 3. NLP Analysis
- Natural.js processes extracted text
- Pattern matching identifies medicine names, dosages, and frequencies
- Medical terms and symptoms are extracted using compromise.js

### 4. AI Diagnosis
- Rule-based system analyzes medicines and symptoms
- Confidence scores calculated based on keyword matches
- Recommendations provided for each potential condition

### 5. Results Display
- Medicine cards show detailed information including side effects
- Diagnosis cards display AI analysis with confidence levels
- Interactive map shows nearby healthcare providers

## Database Schema

### Prescriptions Table
- id, original_filename, file_path, extracted_text
- processed_data, status, created_at, updated_at

### Medicines Table
- id, name, generic_name, category, description
- side_effects, interactions, created_at

### Doctors Table
- id, name, specialty, rating, address, phone
- latitude, longitude, availability, created_at

### Diagnoses Table
- id, prescription_id, condition_name, confidence
- description, severity, recommendations, created_at

## Production Deployment

### Environment Variables
Create a `.env` file with:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=path/to/production.db
UPLOAD_DIR=./uploads
```

### Build for Production
```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

### External API Integration
For production use, integrate with:
- **Google Vision API** for enhanced OCR
- **RxNorm API** for comprehensive medicine data
- **Google Maps API** for real location services
- **OpenFDA API** for drug safety information

## Security Considerations

- File upload validation and size limits
- SQL injection prevention with parameterized queries
- Input sanitization for all user data
- CORS configuration for cross-origin requests
- Error handling to prevent information disclosure

## Future Enhancements

- User authentication and prescription history
- Real-time notifications for medicine interactions
- Integration with pharmacy APIs for price comparison
- Telemedicine appointment booking
- Multi-language support for international use
- Mobile app development using React Native

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.