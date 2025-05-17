import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const register = async (formData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would use:
      // const res = await axios.post('/api/auth/register', formData);
      
      setUser({
        username: formData.username,
        email: formData.email
      });
      
      setAuthMessage(`You have successfully registered. Welcome ${formData.username} to saving Jouney!`);
      setIsSuccess(true);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setAuthMessage('');
        setIsSuccess(false);
      }, 5000);
      
      return true;
    } catch (err) {
      setAuthMessage(err.response?.data?.message || 'Registration failed');
      setIsSuccess(false);
      return false;
    }
  };

  const login = async (formData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would use:
      // const res = await axios.post('/api/auth/login', formData);
      
      setUser({
        username: 'DemoUser', // In real app: res.data.user.username
        email: formData.email
      });
      
      const greeting = getTimeBasedGreeting();
      setAuthMessage(`${greeting}, DemoUser!`); // In real app: res.data.user.username
      setIsSuccess(true);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setAuthMessage('');
        setIsSuccess(false);
      }, 5000);
      
      return true;
    } catch (err) {
      setAuthMessage(err.response?.data?.message || 'Login failed');
      setIsSuccess(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthMessage('You have been logged out');
    setIsSuccess(true);
    
    setTimeout(() => {
      setAuthMessage('');
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      authMessage,
      isSuccess,
      register, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;