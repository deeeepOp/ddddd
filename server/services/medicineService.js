// Service for fetching detailed medicine information
// In a production environment, this would integrate with external APIs like:
// - RxNorm API
// - openFDA API
// - Drugs.com API

export async function getMedicineDetails(medicineName) {
  try {
    console.log('Fetching medicine details for:', medicineName);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would make actual API calls
    const mockDetails = generateMockMedicineDetails(medicineName);
    
    return mockDetails;
  } catch (error) {
    console.error('Error fetching medicine details:', error);
    return {
      warnings: ['Unable to fetch detailed information at this time'],
      contraindications: [],
      dosageInfo: 'Consult your healthcare provider for proper dosage',
      mechanismOfAction: 'Information not available'
    };
  }
}

function generateMockMedicineDetails(medicineName) {
  const lowerName = medicineName.toLowerCase();
  
  if (lowerName.includes('amoxicillin')) {
    return {
      warnings: [
        'May cause allergic reactions in penicillin-sensitive patients',
        'Complete the full course even if feeling better',
        'May reduce effectiveness of oral contraceptives'
      ],
      contraindications: [
        'Penicillin allergy',
        'Severe kidney disease',
        'Mononucleosis'
      ],
      dosageInfo: 'Typical adult dose: 250-500mg every 8 hours or 500-875mg every 12 hours',
      mechanismOfAction: 'Beta-lactam antibiotic that inhibits bacterial cell wall synthesis'
    };
  } else if (lowerName.includes('ibuprofen')) {
    return {
      warnings: [
        'May increase risk of heart attack or stroke',
        'Can cause stomach bleeding',
        'Avoid alcohol while taking this medication'
      ],
      contraindications: [
        'Active peptic ulcer',
        'Severe heart failure',
        'Third trimester of pregnancy'
      ],
      dosageInfo: 'Adult dose: 200-400mg every 4-6 hours, maximum 1200mg per day',
      mechanismOfAction: 'NSAID that inhibits COX enzymes, reducing inflammation and pain'
    };
  } else if (lowerName.includes('vitamin d')) {
    return {
      warnings: [
        'High doses may cause hypercalcemia',
        'Monitor calcium levels with long-term use',
        'May interact with certain medications'
      ],
      contraindications: [
        'Hypercalcemia',
        'Kidney stones',
        'Sarcoidosis'
      ],
      dosageInfo: 'Typical dose: 600-2000 IU daily, depending on deficiency level',
      mechanismOfAction: 'Hormone precursor that regulates calcium absorption and bone metabolism'
    };
  }
  
  return {
    warnings: ['Consult healthcare provider for specific warnings'],
    contraindications: ['Individual contraindications may apply'],
    dosageInfo: 'Follow prescribed dosage instructions',
    mechanismOfAction: 'Mechanism of action varies by medication type'
  };
}

export async function searchMedicineDatabase(query) {
  // In production, this would search external medicine databases
  console.log('Searching medicine database for:', query);
  
  // Mock search results
  return [
    {
      name: query,
      genericName: query.toLowerCase(),
      category: 'Unknown',
      description: 'Medicine information available upon request'
    }
  ];
}