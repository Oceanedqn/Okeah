// PrivateRoute.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PrivateRouteProps } from '../types';



const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Récupération du token depuis les cookies
  const token = Cookies.get('token'); // Get the token from cookies
  const isAuthenticated = !!token; // Check if token exists

  return isAuthenticated ? (
    <>{children}</> // If authenticated, render the children
  ) : (
    <Navigate to="/login" /> // Otherwise, redirect to login
  );
};

export default PrivateRoute;