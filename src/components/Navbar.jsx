import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); 
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white px-8 py-4 flex justify-between items-center shadow-md w-full">
      <Link to="/" className="text-2xl font-bold tracking-wide text-red-500">
        SaccoPulse
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-red-500 font-medium transition">Home</Link>
        <Link to="/report" className="hover:text-red-500 font-medium transition">Report Issue</Link>
        <Link to="/dashboard" className="hover:text-red-500 font-medium transition">Owner Dashboard</Link>

        {user ? (
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-bold transition shadow-sm"
          >
            Logout
          </button>
        ) : (
        <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-bold transition shadow-sm">
          Login
        </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

