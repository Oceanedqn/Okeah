// PrivateRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCurrentUser } from 'src/services/userService';
import LoadingComponent from './base/LoadingComponent';

export interface PrivateRouteProps {
  children: React.ReactNode; // Use children prop to receive the component to render
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Stocke l'utilisateur actif
  const [loading, setLoading] = useState(true); // Gère l'état de chargement
  const [error, setError] = useState<string | null>(null); // Gère les erreurs

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (err) {
        setError('Pas autorisé, veuillez vous reconnecter');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Attendre que le chargement soit terminé avant de décider quoi faire
  if (loading) {
    return <LoadingComponent />;
  }

  // Si une erreur est survenue ou qu'aucun utilisateur n'est trouvé, redirige vers la page de login
  if (error || !user) {
    return <Navigate to="/login" />;
  }

  // Sinon, l'utilisateur est authentifié et on rend les enfants
  return <>{children}</>;
};

export default PrivateRoute;