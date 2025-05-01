/**
 * ItineraryCard.jsx
 * 
 * Card component for displaying an itinerary summary.
 * 
 * @component
 * @description
 * Displays a card with:
 * - Region-specific background image
 * - Itinerary title
 * - Description (truncated to 2 lines)
 * - Duration in days
 * - View Details button
 * 
 * @props
 * @property {Object} itinerary - The itinerary data to display
 * @property {string} itinerary.title - The title of the itinerary
 * @property {string} itinerary.description - The description of the itinerary
 * @property {string} itinerary.region - The region of the itinerary
 * @property {Array} itinerary.days - Array of days in the itinerary
 * @property {Function} onViewDetails - Callback function when View Details is clicked
 * 
 * @example
 * <ItineraryCard 
 *   itinerary={itineraryData}
 *   onViewDetails={() => handleViewDetails(itineraryData)}
 * />
 */

import { getImageForRegion } from '../utils/imageUtils';

const ItineraryCard = ({ itinerary, onViewDetails }) => {
  const imageUrl = getImageForRegion(itinerary.region);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={itinerary.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{itinerary.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{itinerary.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">
              {itinerary.days.length} {itinerary.days.length === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard; 