import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        SaccoPulse
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-red-500 font-medium transition">Home</Link>
        <Link to="/report" className="hover:text-red-500 font-medium transition">Report Issue</Link>
        <Link to="/dashboard" className="hover:text-red-500 font-medium transition">Owner Dashboard</Link>
        
        <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-bold transition shadow-sm">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

