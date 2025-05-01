import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItineraries, getRecommendedItineraries } from '../../api/itineraryApi';
import ItineraryCard from '../../components/ItineraryCard';
import ItineraryModal from '../../components/ItineraryModal';
import AddItineraryModal from '../../components/AddItineraryModal';
import HeroSection from '../../components/HeroSection';
import { PlusIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recommendedDays, setRecommendedDays] = useState('');
  const [showRecommended, setShowRecommended] = useState(false);
  const queryClient = useQueryClient();

  const { data: itineraries, isLoading, error } = useQuery({
    queryKey: ['itineraries'],
    queryFn: getItineraries,
  });

  const { data: recommendedItineraries, isLoading: isLoadingRecommended } = useQuery({
    queryKey: ['recommendedItineraries', recommendedDays],
    queryFn: () => getRecommendedItineraries(recommendedDays),
    enabled: showRecommended && recommendedDays >= 2 && recommendedDays <= 8,
  });

  const handleSearchRecommended = (e) => {
    e.preventDefault();
    if (recommendedDays >= 2 && recommendedDays <= 8) {
      setShowRecommended(true);
    }
  };

  const handleShowAll = () => {
    setShowRecommended(false);
    setRecommendedDays('');
  };

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

          {/* Recommendation Search Section */}
          <div className="mb-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Get Recommended Itineraries</h2>
            <form onSubmit={handleSearchRecommended} className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="days" className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Days (2-8)
                </label>
                <input
                  type="number"
                  id="days"
                  value={recommendedDays}
                  onChange={(e) => setRecommendedDays(parseInt(e.target.value))}
                  min="2"
                  max="8"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter number of days"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Search
                </button>
              </div>
            </form>
            {showRecommended && (
              <button
                onClick={handleShowAll}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Show All Itineraries
              </button>
            )}
          </div>

          {isLoading || (showRecommended && isLoadingRecommended) ? (
            <div className="text-center text-white">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">Error loading itineraries</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showRecommended ? recommendedItineraries : itineraries)?.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onViewDetails={() => setSelectedItinerary(itinerary)}
                />
              ))}
            </div>
          )}
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