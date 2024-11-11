import { useEffect, useRef } from 'react';
import { getUserData, logoutUser } from '../services/auth';

const SessionManager = ({ onLogin, onLogout, inactivityLimit = 60000 }) => {
  const timeoutIdRef = useRef(null); 

  useEffect(() => {
    const startInactivityTimer = () => {
      
      timeoutIdRef.current = setTimeout(async () => {
        await handleLogout();
      }, inactivityLimit);
    };

    const resetInactivityTimer = () => {
      
      clearTimeout(timeoutIdRef.current);
      startInactivityTimer(); 
    };

    const handleLogout = async () => {
      console.log('Handling logout due to inactivity');
      clearTimeout(timeoutIdRef.current); 
      const { error } = await logoutUser();
      if (!error) {
        console.log('Logout successful');
        localStorage.removeItem('userData');
        onLogout();
      } else {
        console.log('Error during logout:', error);
      }
    };

    const initializeSession = async () => {
      console.log('Initializing session...');
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        onLogin(userData); 
        startInactivityTimer();
      } else {
        const userData = await getUserData();
        if (userData) {
          localStorage.setItem('userData', JSON.stringify(userData));
          onLogin(userData);
          startInactivityTimer();
        }
      }
    };

    initializeSession();

    
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    return () => {
      console.log('Cleaning up session manager');
      clearTimeout(timeoutIdRef.current); 
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, [onLogin, onLogout, inactivityLimit]); 

  return null;
};

export default SessionManager;
