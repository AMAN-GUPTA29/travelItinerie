import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getItineraries } from '../../api/itineraryApi';
import ItineraryCard from '../../components/ItineraryCard';
import ItineraryModal from '../../components/ItineraryModal';

const HomePage = () => {
  const [selectedItinerary, setSelectedItinerary] = useState(null);

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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Travel Itineraries</h1>
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

      <ItineraryModal
        isOpen={!!selectedItinerary}
        onClose={() => setSelectedItinerary(null)}
        itinerary={selectedItinerary}
      />
    </div>
  );
};

export default HomePage; 