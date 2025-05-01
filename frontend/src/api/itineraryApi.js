export const getItineraries = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/itineraries');
    if (!response.ok) {
      throw new Error('Failed to fetch itineraries');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    throw error;
  }
};

export const getItineraryById = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/itineraries/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch itinerary details');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching itinerary details:', error);
    throw error;
  }
}; 