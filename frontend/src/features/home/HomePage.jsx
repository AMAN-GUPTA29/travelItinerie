import { useQuery } from '@tanstack/react-query';
import { getItineraries } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import HeroSection from '../../components/HeroSection';
import ItineraryModal from '../../components/ItineraryModal';
import { useState } from 'react';

const getImageForRegion = (region, index) => {
  const allImages = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', // Beach resort
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg', // Beach sunset
    'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg', // Paris night
    'https://images.pexels.com/photos/34142/pexels-photo.jpg', // Tokyo city
    'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg', // New York
    'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', // London
    'https://images.pexels.com/photos/1250289/pexels-photo-1250289.jpeg', // Rome
    'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg', // Sydney
    'https://images.pexels.com/photos/3228766/pexels-photo-3228766.jpeg', // Dubai
    'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg', // Barcelona
    'https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg', // Bali
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg', // Beach
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg', // Resort
    'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg', // City night
    'https://images.pexels.com/photos/34142/pexels-photo.jpg', // Cityscape
  ];
  
  // Use the index to cycle through different images
  return allImages[index % allImages.length];
};

const ItineraryCard = ({ itinerary, index, onViewDetails }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={getImageForRegion(itinerary.region, index)} 
          alt={itinerary.title}
          className="w-full h-full object-cover"
        />
        {itinerary.is_recommended && (
          <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900 text-primary-200">
            Recommended
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold text-white mb-2">{itinerary.title}</h2>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {itinerary.region}
          </div>
          <span>•</span>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {itinerary.total_nights} nights
          </div>
        </div>

        <p className="text-gray-300 mb-6 flex-grow">{itinerary.description}</p>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">${itinerary.price}</span>
            <button 
              onClick={() => onViewDetails(itinerary)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const { data: itineraries, isLoading, error } = useQuery({
    queryKey: ['itineraries'],
    queryFn: getItineraries,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading itineraries. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Itineraries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary, index) => (
              <ItineraryCard 
                key={itinerary.id} 
                itinerary={itinerary} 
                index={index}
                onViewDetails={setSelectedItinerary}
              />
            ))}
          </div>
        </div>
      </div>

      <ItineraryModal
        isOpen={!!selectedItinerary}
        onClose={() => setSelectedItinerary(null)}
        itinerary={selectedItinerary}
      />
    </div>
  );
};

export default HomePage;