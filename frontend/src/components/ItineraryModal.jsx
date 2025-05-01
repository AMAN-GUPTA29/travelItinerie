import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ItineraryModal = ({ isOpen, onClose, itinerary }) => {
  const navigate = useNavigate();

  if (!itinerary) return null;

  const handleViewFullDetails = () => {
    navigate(`/itinerary/${itinerary.id}`);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white mb-4">
                      {itinerary.title}
                    </Dialog.Title>
                    
                    <div className="mt-2">
                      <p className="text-gray-300 mb-6">{itinerary.description}</p>
                      
                      <div className="space-y-8">
                        {itinerary.days.map((day) => (
                          <div key={day.id} className="bg-gray-700 rounded-lg p-4">
                            <h4 className="text-xl font-semibold text-white mb-4">Day {day.day_number}</h4>
                            
                            {/* Accommodations */}
                            {day.accommodations.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-lg font-medium text-white mb-2">Accommodation</h5>
                                {day.accommodations.map((acc) => (
                                  <div key={acc.id} className="bg-gray-600 rounded p-3 mb-2">
                                    <p className="text-white font-medium">{acc.name}</p>
                                    <p className="text-gray-300 text-sm">{acc.description}</p>
                                    <div className="text-gray-400 text-sm mt-1">
                                      <span>Check-in: {new Date(acc.check_in_time).toLocaleTimeString()}</span>
                                      <span className="mx-2">•</span>
                                      <span>Check-out: {new Date(acc.check_out_time).toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Activities */}
                            {day.activities.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-lg font-medium text-white mb-2">Activities</h5>
                                {day.activities.map((activity) => (
                                  <div key={activity.id} className="bg-gray-600 rounded p-3 mb-2">
                                    <p className="text-white font-medium">{activity.name}</p>
                                    <p className="text-gray-300 text-sm">{activity.description}</p>
                                    <div className="text-gray-400 text-sm mt-1">
                                      <span>Location: {activity.location}</span>
                                      <span className="mx-2">•</span>
                                      <span>Time: {new Date(activity.start_time).toLocaleTimeString()} - {new Date(activity.end_time).toLocaleTimeString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Transfers */}
                            {day.transfers.length > 0 && (
                              <div>
                                <h5 className="text-lg font-medium text-white mb-2">Transfers</h5>
                                {day.transfers.map((transfer) => (
                                  <div key={transfer.id} className="bg-gray-600 rounded p-3 mb-2">
                                    <p className="text-white font-medium">{transfer.transfer_type}</p>
                                    <div className="text-gray-300 text-sm">
                                      <p>From: {transfer.from_location}</p>
                                      <p>To: {transfer.to_location}</p>
                                    </div>
                                    <div className="text-gray-400 text-sm mt-1">
                                      <span>Departure: {new Date(transfer.departure_time).toLocaleTimeString()}</span>
                                      <span className="mx-2">•</span>
                                      <span>Arrival: {new Date(transfer.arrival_time).toLocaleTimeString()}</span>
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
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleViewFullDetails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Full Details
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ItineraryModal;
