import { useState, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItineraries } from '../../api/itineraryApi';
import ItineraryCard from '../../components/ItineraryCard';
import ItineraryModal from '../../components/ItineraryModal';
import AddItineraryModal from '../../components/AddItineraryModal';
import HeroSection from '../../components/HeroSection';
import { PlusIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: itineraries, isLoading, error } = useQuery({
    queryKey: ['itineraries'],
    queryFn: getItineraries,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading itineraries: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-white">Travel Itineraries</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Itinerary
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries?.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onViewDetails={() => setSelectedItinerary(itinerary)}
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

      <AddItineraryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default HomePage; 