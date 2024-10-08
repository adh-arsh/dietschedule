import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WeekPlanner from './views/WeekPlanner';
import Login from './views/Login';
import Signup from './views/Signup';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isAuthenticated } = useAuth(); 

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={isAuthenticated ? <WeekPlanner /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
