// Service for location-based doctor search
// In production, this would integrate with Google Maps API or similar services

export function findNearbyDoctors(doctors, userLat, userLng, radiusKm = 10) {
  const nearbyDoctors = doctors
    .map(doctor => {
      const distance = calculateDistance(
        userLat, userLng,
        doctor.latitude, doctor.longitude
      );
      
      return {
        ...doctor,
        distance: distance,
        distanceText: formatDistance(distance)
      };
    })
    .filter(doctor => doctor.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
  
  return nearbyDoctors;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  } else {
    return `${distanceKm.toFixed(1)}km away`;
  }
}

export async function getLocationFromAddress(address) {
  // In production, this would use geocoding API
  console.log('Geocoding address:', address);
  
  // Mock geocoding result
  return {
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    formattedAddress: address
  };
}