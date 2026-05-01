import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Team Task Manager</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
        <span style={{ color: '#667eea' }}>Welcome, {user?.name}</span>
        <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '5px 15px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;