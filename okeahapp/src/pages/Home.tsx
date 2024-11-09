import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/userService';
import { Container, LinksContainer, StyledLink, WelcomeTitle } from '../styles/HomeStyles';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Garder l'utilisateur actif
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser); // Mettre à jour l'état avec les données de l'utilisateur actif
      } catch (err: any) {
        setError('Failed to load user data');
      }
    };

    fetchUser();
  }, []); // Cette fonction sera exécutée lorsque le composant se monte

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <WelcomeTitle>Bienvenue, {user.firstname}!</WelcomeTitle>

      <LinksContainer>
        {/* Exemple de conteneurs carrés redirigeant vers d'autres pages */}
        <StyledLink to="/enigmato/home" color="primary_dark">
          <h3>Enigmato</h3>
        </StyledLink>
        <StyledLink to="/other-page" color="primary">
          <h3>Autre Page</h3>
        </StyledLink>
        <StyledLink to="/another-page" color="primary_light">
          <h3>Une autre page</h3>
        </StyledLink>
      </LinksContainer>
    </Container>
  );
};

export default Home;

// Styled Components



