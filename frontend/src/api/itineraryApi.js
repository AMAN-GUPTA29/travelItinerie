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
    console.log('Sending data:', JSON.stringify(itineraryData, null, 2)); // Pretty print the data
    
    const response = await fetch('http://127.0.0.1:8000/api/v1/itineraries/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(itineraryData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response:', JSON.stringify(data, null, 2)); // Pretty print the error
      if (response.status === 422) {
        // Handle validation errors
        const errorMessage = data.detail || 'Validation error';
        const validationErrors = data.errors || {};
        throw new Error(JSON.stringify({ message: errorMessage, errors: validationErrors }));
      }
      throw new Error(data.detail || 'Failed to create itinerary');
    }

    console.log('Success response:', JSON.stringify(data, null, 2)); // Pretty print the success
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getRecommendedItineraries = async (days) => {
  try {
    console.log('Fetching recommendations for days:', days);
    const response = await fetch(`http://127.0.0.1:8000/api/v1/itineraries/recommendations/${days}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404 && errorData.detail === `No recommended itineraries found for ${days} nights`) {
        return []; // Return empty array when no recommendations found
      }
      throw new Error(errorData.detail || 'Failed to fetch recommended itineraries');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}; 