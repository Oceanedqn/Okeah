import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle, TitleH3Style } from '../../styles/GlobalStyles';
import { Container, GameExplanation, Title, OngoingGamesContainer, OngoingGameItem, OngoingTitle } from '../../styles/EnigmatoStyles';
import { getOngoingPartiesByUser } from '../../services/enigmato/enigmatoPartiesService'; // Importer le service pour récupérer les parties
import { EnigmatoParty } from '../../interfaces/IEnigmato';

const EnigmatoHome: React.FC = () => {
  const navigate = useNavigate();
  const [ongoingGames, setOngoingGames] = useState<EnigmatoParty[]>([]);  // Correction du type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOngoingGames = async () => {
      try {
        setLoading(true);

        // Appel du service pour récupérer les parties en cours
        const games = await getOngoingPartiesByUser(); 
        if (games.length === 0) {
          setError('Il n\'y a aucune partie en cours.');
        } else {
          setOngoingGames(games);  // Sinon, mettre à jour l'état avec les parties récupérées
        }
      } catch (error) {
        setError('Impossible de récupérer les parties en cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingGames();
  }, []); // Le token est récupéré directement dans useEffect, donc pas besoin de le mettre dans les dépendances.

  // Fonction pour naviguer vers la page EnigmatoParties
  const handleJoinGame = () => {
    navigate('/enigmato/parties');
  };

  // Fonction pour naviguer vers la page de jeu spécifique
  const handleViewGame = (id: number) => {
    navigate(`/enigmato/parties/${id}/game`);
  };

  if (loading) {
    return <div>Chargement des parties...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>Bienvenue dans le Qui-est-ce ? x Sogeti</Title>

      {ongoingGames.length === 0 ? (
        <GameExplanation>
          Actuellement, il n'y a pas de parties en cours. Veuillez rejoindre une partie.
        </GameExplanation>
      ) : (
        <OngoingGamesContainer>
          <OngoingTitle>Parties en cours</OngoingTitle>
          {ongoingGames.map((game) => (
            <OngoingGameItem key={game.id_party}>
              {game.name}
              <ButtonStyle onClick={() => handleViewGame(game.id_party)}>Voir</ButtonStyle>
            </OngoingGameItem>
          ))}
        </OngoingGamesContainer>
      )}

      <ButtonStyle onClick={handleJoinGame}>Rejoindre une partie</ButtonStyle>
      <TitleH3Style>Explication du jeu</TitleH3Style>
      <GameExplanation>
        Dans ce jeu inspiré du classique "Qui-est-ce ?", votre objectif est de deviner l'identité de l'adversaire en posant des questions stratégiques. 
        En collaboration avec Sogeti, nous vous offrons une expérience unique et interactive où chaque partie mettra votre intuition et votre logique à l'épreuve.
      </GameExplanation>
    </Container>
  );
};

export default EnigmatoHome;