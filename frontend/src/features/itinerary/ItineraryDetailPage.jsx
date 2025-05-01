import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getItineraryById } from '../../api/itineraryApi';
import { getImageForRegion } from '../../utils/imageUtils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: itinerary, isLoading, error } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItineraryById(id),
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
        <div className="text-red-500">Error loading itinerary: {error.message}</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Itinerary not found</div>
      </div>
    );
  }

  const imageUrl = getImageForRegion(itinerary.region);

  // Calculate total nights
  const totalNights = itinerary.days?.reduce((total, day) => {
    return total + (day.accommodations?.length > 0 ? 1 : 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Itineraries
        </button>

        {/* Header Section */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={imageUrl}
            alt={itinerary.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{itinerary.title}</h1>
            <p className="text-gray-300 text-lg">{itinerary.description}</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Trip Details</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="font-medium">Region:</span> {itinerary.region || 'N/A'}</p>
                <p><span className="font-medium">Duration:</span> {itinerary.days?.length || 0} Days</p>
                <p><span className="font-medium">Total Nights:</span> {totalNights} Nights</p>
                <p><span className="font-medium">Price:</span> ${itinerary.price?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Days Section */}
        <div className="space-y-8">
          {itinerary.days?.map((day) => (
            <div key={day.id} className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Day {day.day_number}</h2>
              
              {/* Accommodations */}
              {day.accommodations?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Accommodation</h3>
                  {day.accommodations.map((acc) => (
                    <div key={acc.id} className="bg-gray-700 rounded-lg p-4 mb-3">
                      <h4 className="text-lg font-medium text-white mb-2">{acc.name}</h4>
                      <p className="text-gray-300 mb-2">{acc.description}</p>
                      <div className="text-gray-400 text-sm">
                        <p>Check-in: {acc.check_in_time ? new Date(acc.check_in_time).toLocaleTimeString() : 'N/A'}</p>
                        <p>Check-out: {acc.check_out_time ? new Date(acc.check_out_time).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activities */}
              {day.activities?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Activities</h3>
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="bg-gray-700 rounded-lg p-4 mb-3">
                      <h4 className="text-lg font-medium text-white mb-2">{activity.name}</h4>
                      <p className="text-gray-300 mb-2">{activity.description}</p>
                      <div className="text-gray-400 text-sm">
                        <p>Location: {activity.location || 'N/A'}</p>
                        <p>Time: {activity.start_time && activity.end_time ? 
                          `${new Date(activity.start_time).toLocaleTimeString()} - ${new Date(activity.end_time).toLocaleTimeString()}` : 
                          'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Transfers */}
              {day.transfers?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Transfers</h3>
                  {day.transfers.map((transfer) => (
                    <div key={transfer.id} className="bg-gray-700 rounded-lg p-4 mb-3">
                      <h4 className="text-lg font-medium text-white mb-2">{transfer.transfer_type}</h4>
                      <div className="text-gray-300 mb-2">
                        <p>From: {transfer.from_location || 'N/A'}</p>
                        <p>To: {transfer.to_location || 'N/A'}</p>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <p>Departure: {transfer.departure_time ? new Date(transfer.departure_time).toLocaleTimeString() : 'N/A'}</p>
                        <p>Arrival: {transfer.arrival_time ? new Date(transfer.arrival_time).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetailPage; 