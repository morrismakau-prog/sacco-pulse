import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [locationResults, setLocationResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

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
              <li key={location.place_id} className="px-6 py-3 border-b border-gray-700 last:border-0 hover:bg-gray-700 cursor-pointer text-gray-200">
                 {location.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-red-600">
          <h2 className="text-xl font-bold text-white">Super Metro</h2>
          <p className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</p>
          <p className="text-gray-300 mt-2">"Great service, very clean buses."</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-t-4 border-red-600">
          <h2 className="text-xl font-bold text-white">Embassava</h2>
          <p className="text-yellow-500 text-lg">⭐⭐⭐</p>
          <p className="text-gray-300 mt-2">"Buses are fast but overcharge during rush hour."</p>
        </div>
      </div>
    </div>
  );
};

export default Home;