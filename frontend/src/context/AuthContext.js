// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get(`${API_URL}/auth/me`);
//       setUser(data);
//     } catch (error) {
//       localStorage.removeItem('token');
//       delete axios.defaults.headers.common['Authorization'];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const { data } = await axios.post(`${API_URL}/auth/login`, {
//         email,
//         password
//       });
//       localStorage.setItem('token', data.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//       setUser(data);
//       toast.success('Login successful!');
//       return true;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed');
//       return false;
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       const { data } = await axios.post(`${API_URL}/auth/register`, {
//         name,
//         email,
//         password,
//         role
//       });
//       localStorage.setItem('token', data.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//       setUser(data);
//       toast.success('Registration successful!');
//       return true;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Registration failed');
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variable with fallback
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
      const { data } = await axios.get(`${API_URL}/auth/me`);
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
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      const { data } = await axios.post(`${API_URL}/auth/login`, {
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
      console.log('Attempting registration to:', `${API_URL}/auth/register`);
      const { data } = await axios.post(`${API_URL}/auth/register`, {
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