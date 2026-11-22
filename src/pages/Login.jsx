import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isOwner, setIsOwner] = useState(false);
  const [saccoName, setSaccoName] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // New State

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const MASTER_CODE = "SACCO-VERIFY-2024";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        await login(email, password);
      } else {
        if (isOwner && verificationCode !== MASTER_CODE) {
          throw new Error("Invalid SACCO Verification Code. Please contact the platform admin.");
        }

        const role = isOwner ? 'sacco_owner' : 'passenger';
        await signup(email, password, role, saccoName);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to log in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-72px)] py-10">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-red-900 border border-red-600 text-white px-4 py-3 rounded relative mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email" 
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password" 
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {!isLogin && (
            <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="checkbox" 
                  id="isOwner" 
                  checked={isOwner}
                  onChange={(e) => setIsOwner(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="isOwner" className="text-gray-300 font-medium cursor-pointer">
                  Register as a SACCO Owner
                </label>
              </div>

              {isOwner && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">SACCO Name</label>
                    <input 
                      type="text" 
                      value={saccoName}
                      onChange={(e) => setSaccoName(e.target.value)}
                      required={isOwner}
                      placeholder="e.g., Super Metro" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Verification Code</label>
                    <input 
                      type="password" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required={isOwner}
                      placeholder="Enter secret code" 
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 mt-4 disabled:bg-gray-500"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button" 
          className="w-full bg-gray-700 border border-gray-600 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 flex justify-center items-center disabled:bg-gray-800"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setIsOwner(false);
              setVerificationCode('');
            }} 
            className="text-red-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;