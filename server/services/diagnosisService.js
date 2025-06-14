import natural from 'natural';

// Medical condition patterns and keywords
const conditionPatterns = {
  'Bacterial Respiratory Infection': {
    keywords: ['antibiotic', 'amoxicillin', 'azithromycin', 'cough', 'fever', 'respiratory'],
    severity: 'medium',
    confidence: 0.8
  },
  'Inflammatory Pain': {
    keywords: ['ibuprofen', 'naproxen', 'inflammation', 'pain', 'swelling'],
    severity: 'low',
    confidence: 0.7
  },
  'Vitamin D Deficiency': {
    keywords: ['vitamin d', 'cholecalciferol', 'bone', 'deficiency'],
    severity: 'low',
    confidence: 0.6
  },
  'Hypertension': {
    keywords: ['lisinopril', 'amlodipine', 'blood pressure', 'hypertension'],
    severity: 'medium',
    confidence: 0.75
  },
  'Diabetes Management': {
    keywords: ['metformin', 'insulin', 'diabetes', 'glucose', 'blood sugar'],
    severity: 'high',
    confidence: 0.85
  },
  'Acid Reflux': {
    keywords: ['omeprazole', 'pantoprazole', 'reflux', 'heartburn', 'acid'],
    severity: 'low',
    confidence: 0.7
  }
};

const recommendations = {
  'Bacterial Respiratory Infection': [
    'Complete the full course of antibiotics',
    'Rest and stay hydrated',
    'Monitor symptoms and fever',
    'Follow up if symptoms worsen'
  ],
  'Inflammatory Pain': [
    'Take medication with food',
    'Apply ice or heat as appropriate',
    'Avoid overexertion',
    'Monitor for side effects'
  ],
  'Vitamin D Deficiency': [
    'Take supplement consistently',
    'Increase safe sun exposure',
    'Include vitamin D rich foods',
    'Follow up with blood tests'
  ],
  'Hypertension': [
    'Take medication as prescribed',
    'Monitor blood pressure regularly',
    'Maintain low-sodium diet',
    'Exercise regularly'
  ],
  'Diabetes Management': [
    'Monitor blood glucose levels',
    'Follow prescribed diet plan',
    'Take medication as directed',
    'Regular medical check-ups'
  ],
  'Acid Reflux': [
    'Take medication before meals',
    'Avoid trigger foods',
    'Eat smaller, frequent meals',
    'Elevate head while sleeping'
  ]
};

export async function generateDiagnosis(extractedText, medicineInfo) {
  try {
    console.log('Starting AI diagnosis generation...');
    
    const text = extractedText.toLowerCase();
    const medicines = medicineInfo.medicines || [];
    const diagnoses = [];
    
    // Analyze text and medicines for potential conditions
    for (const [condition, pattern] of Object.entries(conditionPatterns)) {
      let score = 0;
      let matchedKeywords = [];
      
      // Check for keyword matches in text
      for (const keyword of pattern.keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      }
      
      // Check for medicine matches
      for (const medicine of medicines) {
        const medicineName = medicine.name.toLowerCase();
        for (const keyword of pattern.keywords) {
          if (medicineName.includes(keyword.toLowerCase())) {
            score += 2; // Medicine matches are weighted higher
            matchedKeywords.push(medicine.name);
          }
        }
      }
      
      // Calculate confidence based on matches
      if (score > 0) {
        const confidence = Math.min(
          pattern.confidence + (score * 0.1),
          0.95
        );
        
        diagnoses.push({
          id: generateDiagnosisId(),
          condition,
          confidence: Math.round(confidence * 100),
          description: generateDescription(condition, matchedKeywords),
          severity: pattern.severity,
          recommendations: recommendations[condition] || []
        });
      }
    }
    
    // Sort by confidence and return top diagnoses
    diagnoses.sort((a, b) => b.confidence - a.confidence);
    
    // If no specific diagnoses found, provide general ones
    if (diagnoses.length === 0) {
      diagnoses.push(...getDefaultDiagnoses());
    }
    
    console.log('AI diagnosis generation completed');
    return diagnoses.slice(0, 3); // Return top 3 diagnoses
  } catch (error) {
    console.error('Diagnosis generation error:', error);
    return getDefaultDiagnoses();
  }
}

function generateDescription(condition, matchedKeywords) {
  const descriptions = {
    'Bacterial Respiratory Infection': `Based on the prescribed antibiotics and symptoms, this appears to be a bacterial respiratory tract infection requiring antibiotic treatment. Matched indicators: ${matchedKeywords.join(', ')}.`,
    'Inflammatory Pain': `The prescription of anti-inflammatory medication suggests inflammation-related pain that requires NSAID treatment. Matched indicators: ${matchedKeywords.join(', ')}.`,
    'Vitamin D Deficiency': `Vitamin D supplementation indicates deficiency that needs to be addressed for bone health and immune function. Matched indicators: ${matchedKeywords.join(', ')}.`,
    'Hypertension': `Blood pressure medication suggests hypertension management is required. Matched indicators: ${matchedKeywords.join(', ')}.`,
    'Diabetes Management': `Diabetes medications indicate ongoing blood sugar management. Matched indicators: ${matchedKeywords.join(', ')}.`,
    'Acid Reflux': `Proton pump inhibitors suggest acid reflux or GERD treatment. Matched indicators: ${matchedKeywords.join(', ')}.`
  };
  
  return descriptions[condition] || `Condition identified based on prescription analysis. Matched indicators: ${matchedKeywords.join(', ')}.`;
}

function getDefaultDiagnoses() {
  return [
    {
      id: generateDiagnosisId(),
      condition: 'General Medical Treatment',
      confidence: 60,
      description: 'Based on the prescription, this appears to be routine medical treatment. Consult with your healthcare provider for specific details.',
      severity: 'low',
      recommendations: [
        'Take medications as prescribed',
        'Follow up with your doctor',
        'Monitor for any side effects',
        'Complete the full course of treatment'
      ]
    }
  ];
}

function generateDiagnosisId() {
  return 'diag-' + Math.random().toString(36).substr(2, 9);
}