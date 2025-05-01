export const getItineraries = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/v1/itineraries/');
  
  if (!response.ok) {
    throw new Error('Failed to fetch itineraries');
  }

  return response.json();
};

export const getItineraryById = async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/itineraries/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch itinerary details');
  }

  return response.json();
};

export const createItinerary = async (itineraryData) => {
  try {
    console.log('Sending data:', itineraryData); // Log the data being sent
    
    const response = await fetch('http://127.0.0.1:8000/api/v1/itineraries/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itineraryData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response:', data); // Log the error response
      throw new Error(data.detail || 'Failed to create itinerary');
    }

    console.log('Success response:', data); // Log the success response
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 