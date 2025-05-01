import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItinerary } from '../api/itineraryApi';

const regions = ['Phuket', 'Krabi'];
const transferTypes = ['flight', 'bus', 'boat', 'private transfer', 'taxi'];

const AddItineraryModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_nights: '',
    region: '',
    price: '',
    is_recommended: false,
    days: []
  });
  const [errors, setErrors] = useState({});

  const validatePage1 = () => {
    const newErrors = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.total_nights) {
      newErrors.total_nights = 'Total nights is required';
    } else {
      const nights = parseInt(formData.total_nights);
      if (isNaN(nights) || nights < 2 || nights > 8) {
        newErrors.total_nights = 'Total nights must be between 2 and 8';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors = {};
    
    formData.days.forEach((day, dayIndex) => {
      day.accommodations.forEach((acc, accIndex) => {
        if (!acc.name) newErrors[`accommodation_name_${dayIndex}_${accIndex}`] = 'Accommodation name is required';
        if (!acc.description) newErrors[`accommodation_description_${dayIndex}_${accIndex}`] = 'Accommodation description is required';
        if (!acc.check_in_time) newErrors[`check_in_${dayIndex}_${accIndex}`] = 'Check-in time is required';
        if (!acc.check_out_time) newErrors[`check_out_${dayIndex}_${accIndex}`] = 'Check-out time is required';
      });

      day.activities.forEach((activity, activityIndex) => {
        if (!activity.name) newErrors[`activity_name_${dayIndex}_${activityIndex}`] = 'Activity name is required';
        if (!activity.description) newErrors[`activity_description_${dayIndex}_${activityIndex}`] = 'Activity description is required';
        if (!activity.location) newErrors[`activity_location_${dayIndex}_${activityIndex}`] = 'Activity location is required';
        if (!activity.start_time) newErrors[`activity_start_${dayIndex}_${activityIndex}`] = 'Start time is required';
        if (!activity.end_time) newErrors[`activity_end_${dayIndex}_${activityIndex}`] = 'End time is required';
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      onClose();
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePage2()) {
      try {
        // Clean up the data before sending
        const cleanedData = {
          title: formData.title,
          description: formData.description,
          total_nights: parseInt(formData.total_nights),
          region: formData.region,
          price: parseFloat(formData.price),
          is_recommended: formData.is_recommended,
          days: formData.days.map(day => ({
            day_number: day.day_number,
            accommodations: day.accommodations.map(acc => ({
              name: acc.name,
              description: acc.description,
              check_in_time: acc.check_in_time,
              check_out_time: acc.check_out_time
            })),
            activities: day.activities.map(activity => ({
              name: activity.name,
              description: activity.description,
              start_time: activity.start_time,
              end_time: activity.end_time,
              location: activity.location
            })),
            transfers: day.transfers.filter(transfer => 
              transfer.transfer_type && 
              transfer.from_location && 
              transfer.to_location && 
              transfer.departure_time && 
              transfer.arrival_time
            ).map(transfer => ({
              from_location: transfer.from_location,
              to_location: transfer.to_location,
              transfer_type: transfer.transfer_type,
              departure_time: transfer.departure_time,
              arrival_time: transfer.arrival_time
            }))
          }))
        };
        
        console.log('Sending data:', cleanedData);
        await mutation.mutateAsync(cleanedData);
        onClose();
      } catch (error) {
        console.error('Error creating itinerary:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDayChange = (dayIndex, field, value) => {
    setFormData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        [field]: value
      };
      return {
        ...prev,
        days: newDays
      };
    });
  };

  const handleAccommodationChange = (dayIndex, accIndex, field, value) => {
    setFormData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex].accommodations[accIndex] = {
        ...newDays[dayIndex].accommodations[accIndex],
        [field]: value
      };
      return {
        ...prev,
        days: newDays
      };
    });
    // Clear error when field is modified
    const errorKey = `accommodation_${field}_${dayIndex}_${accIndex}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    setFormData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex].activities[activityIndex] = {
        ...newDays[dayIndex].activities[activityIndex],
        [field]: value
      };
      return {
        ...prev,
        days: newDays
      };
    });
    // Clear error when field is modified
    const errorKey = `activity_${field}_${dayIndex}_${activityIndex}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleTransferChange = (dayIndex, transferIndex, field, value) => {
    setFormData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex].transfers[transferIndex] = {
        ...newDays[dayIndex].transfers[transferIndex],
        [field]: value
      };
      return {
        ...prev,
        days: newDays
      };
    });
    // Clear error when field is modified
    const errorKey = `${field}_${dayIndex}_${transferIndex}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const initializeDays = () => {
    if (validatePage1()) {
      const days = Array.from({ length: parseInt(formData.total_nights) }, (_, index) => ({
        day_number: index + 1,
        accommodations: [{
          name: '',
          description: '',
          check_in_time: '',
          check_out_time: ''
        }],
        activities: [{
          name: '',
          description: '',
          start_time: '',
          end_time: '',
          location: ''
        }],
        transfers: [] // Initialize with empty array
      }));
      setFormData(prev => ({ ...prev, days }));
      setCurrentPage(2);
    }
  };

  const renderPage1 = () => (
    <form onSubmit={(e) => { e.preventDefault(); initializeDays(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            placeholder="Enter itinerary title"
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-1">
            Region
          </label>
          <select
            name="region"
            id="region"
            value={formData.region}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.region ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            required
          >
            <option value="" className="text-gray-400">Select a region</option>
            {regions.map(region => (
              <option key={region} value={region} className="text-white">{region}</option>
            ))}
          </select>
          {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.price ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="total_nights" className="block text-sm font-medium text-gray-300 mb-1">
            Total Nights
          </label>
          <input
            type="number"
            name="total_nights"
            id="total_nights"
            value={formData.total_nights}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.total_nights ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            placeholder="Enter number of nights (2-8)"
            required
            min="2"
            max="8"
          />
          {errors.total_nights && <p className="mt-1 text-sm text-red-500">{errors.total_nights}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
            placeholder="Enter itinerary description"
            required
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_recommended"
              checked={formData.is_recommended}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 transition duration-200"
            />
            <span className="text-sm text-gray-300">Recommended</span>
          </label>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 sm:ml-3 sm:w-auto"
        >
          Next
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 sm:mt-0 sm:w-auto"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderPage2 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formData.days.map((day, dayIndex) => (
        <div key={dayIndex} className="bg-gray-700 rounded-lg p-6 mb-4 shadow-lg">
          <h3 className="text-lg font-medium text-white mb-6">Day {day.day_number}</h3>
          
          {/* Accommodations */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-white mb-3">Accommodation</h4>
            {day.accommodations.map((acc, accIndex) => (
              <div key={accIndex} className="bg-gray-600 rounded-lg p-4 mb-3">
                <input
                  type="text"
                  placeholder="Accommodation Name"
                  value={acc.name}
                  onChange={(e) => handleAccommodationChange(dayIndex, accIndex, 'name', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`accommodation_name_${dayIndex}_${accIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                />
                {errors[`accommodation_name_${dayIndex}_${accIndex}`] && (
                  <p className="text-sm text-red-500 mb-3">{errors[`accommodation_name_${dayIndex}_${accIndex}`]}</p>
                )}
                <textarea
                  placeholder="Description"
                  value={acc.description}
                  onChange={(e) => handleAccommodationChange(dayIndex, accIndex, 'description', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`accommodation_description_${dayIndex}_${accIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                  rows={2}
                />
                {errors[`accommodation_description_${dayIndex}_${accIndex}`] && (
                  <p className="text-sm text-red-500 mb-3">{errors[`accommodation_description_${dayIndex}_${accIndex}`]}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="datetime-local"
                      value={acc.check_in_time}
                      onChange={(e) => handleAccommodationChange(dayIndex, accIndex, 'check_in_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`check_in_${dayIndex}_${accIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`check_in_${dayIndex}_${accIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`check_in_${dayIndex}_${accIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="datetime-local"
                      value={acc.check_out_time}
                      onChange={(e) => handleAccommodationChange(dayIndex, accIndex, 'check_out_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`check_out_${dayIndex}_${accIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`check_out_${dayIndex}_${accIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`check_out_${dayIndex}_${accIndex}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activities */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-white mb-3">Activities</h4>
            {day.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="bg-gray-600 rounded-lg p-4 mb-3">
                <input
                  type="text"
                  placeholder="Activity Name"
                  value={activity.name}
                  onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'name', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`activity_name_${dayIndex}_${activityIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                />
                {errors[`activity_name_${dayIndex}_${activityIndex}`] && (
                  <p className="text-sm text-red-500 mb-3">{errors[`activity_name_${dayIndex}_${activityIndex}`]}</p>
                )}
                <textarea
                  placeholder="Description"
                  value={activity.description}
                  onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'description', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`activity_description_${dayIndex}_${activityIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                  rows={2}
                />
                {errors[`activity_description_${dayIndex}_${activityIndex}`] && (
                  <p className="text-sm text-red-500 mb-3">{errors[`activity_description_${dayIndex}_${activityIndex}`]}</p>
                )}
                <input
                  type="text"
                  placeholder="Location"
                  value={activity.location}
                  onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'location', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`activity_location_${dayIndex}_${activityIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                />
                {errors[`activity_location_${dayIndex}_${activityIndex}`] && (
                  <p className="text-sm text-red-500 mb-3">{errors[`activity_location_${dayIndex}_${activityIndex}`]}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="datetime-local"
                      value={activity.start_time}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'start_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`activity_start_${dayIndex}_${activityIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`activity_start_${dayIndex}_${activityIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`activity_start_${dayIndex}_${activityIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="datetime-local"
                      value={activity.end_time}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, 'end_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`activity_end_${dayIndex}_${activityIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`activity_end_${dayIndex}_${activityIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`activity_end_${dayIndex}_${activityIndex}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transfers */}
          <div>
            <h4 className="text-md font-medium text-white mb-3">Transfers (Optional)</h4>
            {day.transfers.map((transfer, transferIndex) => (
              <div key={transferIndex} className="bg-gray-600 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-white">Transfer {transferIndex + 1}</h5>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => {
                        const newDays = [...prev.days];
                        newDays[dayIndex].transfers = newDays[dayIndex].transfers.filter((_, i) => i !== transferIndex);
                        return { ...prev, days: newDays };
                      });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <select
                  value={transfer.transfer_type}
                  onChange={(e) => handleTransferChange(dayIndex, transferIndex, 'transfer_type', e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`transfer_type_${dayIndex}_${transferIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-3`}
                >
                  <option value="" className="text-gray-400">Select transfer type</option>
                  {transferTypes.map(type => (
                    <option key={type} value={type} className="text-white">{type}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      placeholder="From Location"
                      value={transfer.from_location}
                      onChange={(e) => handleTransferChange(dayIndex, transferIndex, 'from_location', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`from_location_${dayIndex}_${transferIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`from_location_${dayIndex}_${transferIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`from_location_${dayIndex}_${transferIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="To Location"
                      value={transfer.to_location}
                      onChange={(e) => handleTransferChange(dayIndex, transferIndex, 'to_location', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`to_location_${dayIndex}_${transferIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`to_location_${dayIndex}_${transferIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`to_location_${dayIndex}_${transferIndex}`]}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="datetime-local"
                      value={transfer.departure_time}
                      onChange={(e) => handleTransferChange(dayIndex, transferIndex, 'departure_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`departure_time_${dayIndex}_${transferIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`departure_time_${dayIndex}_${transferIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`departure_time_${dayIndex}_${transferIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="datetime-local"
                      value={transfer.arrival_time}
                      onChange={(e) => handleTransferChange(dayIndex, transferIndex, 'arrival_time', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg bg-gray-700 border ${errors[`arrival_time_${dayIndex}_${transferIndex}`] ? 'border-red-500' : 'border-gray-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                    />
                    {errors[`arrival_time_${dayIndex}_${transferIndex}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`arrival_time_${dayIndex}_${transferIndex}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => {
                  const newDays = [...prev.days];
                  newDays[dayIndex].transfers.push({
                    from_location: '',
                    to_location: '',
                    transfer_type: '',
                    departure_time: '',
                    arrival_time: ''
                  });
                  return { ...prev, days: newDays };
                });
              }}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              + Add Transfer
            </button>
          </div>
        </div>
      ))}

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 sm:ml-3 sm:w-auto"
        >
          Create Itinerary
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 sm:mt-0 sm:w-auto"
          onClick={() => setCurrentPage(1)}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>
    </form>
  );

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-2xl font-semibold leading-6 text-white mb-6">
                      {currentPage === 1 ? 'Add New Itinerary' : 'Add Day Details'}
                    </Dialog.Title>
                    {currentPage === 1 ? renderPage1() : renderPage2()}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddItineraryModal; 