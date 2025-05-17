import { createContext, useState } from 'react';
import axios from 'axios';

// Create Axios instance with base config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const clearMessages = () => {
    setAuthMessage('');
    setIsSuccess(false);
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      
      setUser({
        username: data.user.username,
        email: data.user.email
      });
      
      setAuthMessage(`Welcome ${data.user.username} to your saving journey!`);
      setIsSuccess(true);
      
      setTimeout(clearMessages, 5000);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Registration failed';
      setAuthMessage(errorMessage);
      setIsSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      
      setUser(data.user);
      const greeting = getTimeBasedGreeting();
      setAuthMessage(`${greeting}, ${data.user.username}!`);
      setIsSuccess(true);
      
      setTimeout(clearMessages, 5000);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed';
      setAuthMessage(errorMessage);
      setIsSuccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setAuthMessage('You have been logged out');
      setIsSuccess(true);
      setTimeout(clearMessages, 3000);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      authMessage,
      isSuccess,
      isLoading,
      register, 
      login, 
      logout,
      clearMessages
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;