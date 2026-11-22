import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900">
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />

        <Route path="/Dashboard" element={
          <ProtectedRoute requireOwner={true}>
          <Dashboard />
          </ProtectedRoute>
          
          } />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
