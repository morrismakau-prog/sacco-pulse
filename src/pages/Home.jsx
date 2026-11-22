import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaStar, FaRegStar, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setLocationResults([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=ke&limit=5`
      );
      const data = await response.json();
      
      if (data.length === 0) {
        setError('No stages or locations found. Try a different search.');
      } else {
        setLocationResults(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch locations. Check your internet.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className="mr-1">
        {index < rating ? (
          <FaStar className="inline text-yellow-500 text-xl" />
        ) : (
          <FaRegStar className="inline text-gray-500 text-xl" />
        )}
      </span>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome to SaccoPulse
      </h1>
      <p className="text-gray-400 mb-8">
        {user ? `Logged in as: ${user.email}` : 'Search for a SACCO or stage to get started.'}
      </p>

      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <input 
          type="text" 
          placeholder="Search for a Stage (e.g., Westlands, Kondele)..." 
          className="flex-1 px-6 py-4 rounded-lg shadow-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-lg text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900 border border-red-600 text-white px-4 py-3 rounded relative mb-8">
          {error}
        </div>
      )}

      {locationResults.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-lg mb-8 border border-gray-700 overflow-hidden">
          <h3 className="px-6 py-4 bg-gray-900 text-white font-bold border-b border-gray-700">
            Locations Found (via OpenStreetMap)
          </h3>
          <ul>
            {locationResults.map((location) => (
              <li key={location.place_id} className="px-6 py-3 border-b border-gray-700 last:border-0 hover:bg-gray-700 cursor-pointer text-gray-200 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> {location.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Recent Reviews</h2>
      
      {loadingReviews ? (
        <p className="text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to write one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-red-600">
              <h3 className="text-xl font-bold text-white">{review.saccoName}</h3>
              <div className="my-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-300 mt-2">"{review.reviewText}"</p>
              <p className="text-gray-400 text-sm mt-4 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" /> {review.locationName}
              </p>
        
              {review.saccoReply && (
                <div className="mt-3 bg-gray-900 p-3 rounded-md border-l-2 border-red-500">
                  <p className="text-xs text-red-400 font-bold mb-1">SACCO Reply:</p>
                  <p className="text-sm text-gray-300">{review.saccoReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;