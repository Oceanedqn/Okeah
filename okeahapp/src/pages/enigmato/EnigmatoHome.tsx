// pages/EnigmatoHome.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle, TitleH3Style } from '../../styles/GlobalStyles';
import { Container, GameExplanation, Title, OngoingGamesContainer, OngoingGameItem, OngoingTitle } from '../../styles/EnigmatoStyles';

// Exemple de données de parties en cours
const ongoingGamesData = [
    { id: 1, title: 'Partie 1' },
    { id: 2, title: 'Partie 2' },
];

const EnigmatoHome: React.FC = () => {
    const navigate = useNavigate();
    const [ongoingGames, setOngoingGames] = useState<{ id: number; title: string }[]>([]);

    useEffect(() => {
        // Simuler la récupération des données de parties en cours
        // Remplacez cela par une API ou un autre moyen de récupérer les données
        setOngoingGames(ongoingGamesData); // Remplacez cette ligne par votre appel d'API
    }, []);

    // Fonction pour naviguer vers la page EnigmatoParties
    const handleJoinGame = () => {
        navigate('/enigmato/parties');
    };

    // Fonction pour naviguer vers la page de jeu spécifique
    const handleViewGame = (id: number) => {
        navigate(`/enigmato/parties/${id}/game`);
    };

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
                        <OngoingGameItem key={game.id}>
                            {game.title}
                            <ButtonStyle onClick={() => handleViewGame(game.id)}>Voir</ButtonStyle>
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