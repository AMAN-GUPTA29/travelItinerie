/**
 * itineraryApi.js
 * 
 * API functions for interacting with the itinerary backend.
 * 
 * @module
 * @description
 * This module provides functions to:
 * - Fetch all itineraries
 * - Fetch a specific itinerary by ID
 * - Create a new itinerary
 * - Fetch recommended itineraries by duration
 * 
 * All functions handle error cases and provide appropriate error messages.
 */

/**
 * Fetches all itineraries from the API.
 * 
 * @async
 * @function getItineraries
 * @returns {Promise<Array>} Array of itinerary objects
 * @throws {Error} If the API request fails
 */
export const getItineraries = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/v1/itineraries/');
  
  if (!response.ok) {
    throw new Error('Failed to fetch itineraries');
  }

  return response.json();
};

/**
 * Fetches a specific itinerary by its ID.
 * 
 * @async
 * @function getItineraryById
 * @param {string|number} id - The ID of the itinerary to fetch
 * @returns {Promise<Object>} The itinerary object
 * @throws {Error} If the API request fails
 */
export const getItineraryById = async (id) => {
  const response = await fetch(`http://127.0.0.1:8000/api/v1/itineraries/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch itinerary details');
  }

  return response.json();
};

/**
 * Creates a new itinerary.
 * 
 * @async
 * @function createItinerary
 * @param {Object} itineraryData - The itinerary data to create
 * @returns {Promise<Object>} The created itinerary object
 * @throws {Error} If the API request fails or validation errors occur
 */
export const createItinerary = async (itineraryData) => {
  try {
    console.log('Sending data:', JSON.stringify(itineraryData, null, 2));
    
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
      console.error('Error response:', JSON.stringify(data, null, 2));
      if (response.status === 422) {
        const errorMessage = data.detail || 'Validation error';
        const validationErrors = data.errors || {};
        throw new Error(JSON.stringify({ message: errorMessage, errors: validationErrors }));
      }
      throw new Error(data.detail || 'Failed to create itinerary');
    }

    console.log('Success response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fetches recommended itineraries for a specific duration.
 * 
 * @async
 * @function getRecommendedItineraries
 * @param {number} days - The number of days for the recommendation
 * @returns {Promise<Array>} Array of recommended itinerary objects
 * @throws {Error} If the API request fails
 */
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