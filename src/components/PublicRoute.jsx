import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userData'); 

  if (isAuthenticated) {
    return <Navigate to="/" />; 
  }

  return children; 
};

export default PublicRoute;
