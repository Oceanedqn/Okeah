import React, { useEffect, useState } from 'react';
import { Container, LinksContainer, StyledLink, WelcomeTitle } from '../styles/HomeStyles';
import LoadingComponent from '../components/base/LoadingComponent';
import { IUserLocalstorage } from '../interfaces/IUser';
import { useTranslation } from 'react-i18next';


const Home: React.FC = () => {
  const [user, setUser] = useState<IUserLocalstorage>();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = sessionStorage.getItem('user');
        if (userData) {
          const parsedUser: IUserLocalstorage = JSON.parse(userData);
          setUser(parsedUser);
        }
        // Mettre à jour l'état avec les données de l'utilisateur actif
      } catch (err: any) {
        setError('Impossible de charger les données utilisateur');
      }
    };

    fetchUser();
  }, []); // Cette fonction sera exécutée lorsque le composant se monte

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <LoadingComponent />
    );
  }

  return (
    <Container>
      <WelcomeTitle>{t("welcome")}, {user.firstname}!</WelcomeTitle>

      <LinksContainer>
        {/* Exemple de conteneurs carrés redirigeant vers d'autres pages */}
        <StyledLink to="/enigmato/home" color="primary_dark">
          <h3>{t("whois")}</h3>
        </StyledLink>
        <StyledLink to="/home" color="primary">
          <h3>Tasty check (soon)</h3>
        </StyledLink>
        <StyledLink to="/home" color="primary_light">
          <h3>Neatnest (soon)</h3>
        </StyledLink>
      </LinksContainer>
    </Container>
  );
};

export default Home;