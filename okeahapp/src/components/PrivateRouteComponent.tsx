// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PrivateRouteProps } from '../types';



const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Récupération du access_token depuis les cookies
  const access_token = Cookies.get('access_token'); // Get the access_token from cookies
  const isAuthenticated = !!access_token; // Check if access_token exists

  return isAuthenticated ? (
    <>{children}</> // If authenticated, render the children
  ) : (
    <Navigate to="/login" /> // Otherwise, redirect to login
  );
};

export default PrivateRoute;