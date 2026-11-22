import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

const Report = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saccoName, setSaccoName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setLocationResults([]);
    setSelectedLocation(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}&countrycodes=ke&limit=5`
      );
      const data = await response.json();
      if (data.length === 0) setError('No locations found.');
      else setLocationResults(data);
    } catch (err) {
      setError('Failed to fetch locations.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError('Please search and select a location for this review.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, "reviews"), {
        saccoName,
        rating,
        reviewText,
        locationName: selectedLocation.display_name,
        locationLat: selectedLocation.lat,
        locationLon: selectedLocation.lon,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date()
      });
      
      navigate('/');
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 pb-20 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Report an Issue / Write a Review</h2>

        {error && (
          <div className="bg-red-900 border border-red-600 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-gray-300 font-medium mb-2">SACCO Name</label>
            <input 
              type="text" 
              value={saccoName}
              onChange={(e) => setSaccoName(e.target.value)}
              required
              placeholder="e.g., Super Metro, Embassava" 
              className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl focus:outline-none transition transform hover:scale-110"
                >
                  {rating >= star ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-gray-600 p-4 rounded-md bg-gray-900">
            <label className="block text-gray-300 font-medium mb-2">Location / Stage</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search for a stage (e.g., Westlands)..." 
                className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                type="button"
                onClick={handleLocationSearch}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {locationResults.length > 0 && !selectedLocation && (
              <ul className="mt-3 bg-gray-800 border border-gray-600 rounded-md overflow-hidden max-h-40 overflow-y-auto">
                {locationResults.map((loc) => (
                  <li 
                    key={loc.place_id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationResults([]);
                      setLocationQuery(loc.display_name);
                    }}
                    className="px-4 py-2 hover:bg-red-600 cursor-pointer text-sm text-gray-200 border-b border-gray-700 last:border-0"
                  >
                     {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
            
            {selectedLocation && (
              <p className="mt-2 text-green-400 text-sm">
                 Selected: {selectedLocation.display_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Your Review / Issue Description</label>
            <textarea 
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows="4"
              placeholder="What happened? Please provide details..." 
              className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:bg-gray-500 mt-4"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;