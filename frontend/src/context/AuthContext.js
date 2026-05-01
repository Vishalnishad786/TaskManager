import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Make sure API_URL includes /api
const API_URL = process.env.REACT_APP_API_URL || 'https://taskmanager-backend-nfx9.onrender.com/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      // Ensure the URL is correct
      const url = `${API_URL}/auth/me`;
      console.log('Fetching user from:', url);
      const { data } = await axios.get(url);
      setUser(data);
    } catch (error) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const url = `${API_URL}/auth/login`;
      console.log('Login URL:', url);
      const { data } = await axios.post(url, {
        email,
        password
      });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error.response || error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const url = `${API_URL}/auth/register`;
      console.log('Registration URL:', url);
      const { data } = await axios.post(url, {
        name,
        email,
        password,
        role
      });
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error.response || error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};