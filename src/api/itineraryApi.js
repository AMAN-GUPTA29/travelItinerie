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