import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Vérifie si le token existe

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, redirection vers la page de connexion
    return <Navigate to="/login" />;
  }

  return children; // Si authentifié, rend le composant enfant passé à ProtectedRoute
};

export default ProtectedRoute;