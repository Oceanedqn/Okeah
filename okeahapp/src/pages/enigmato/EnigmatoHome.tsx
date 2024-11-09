import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importer le hook useTranslation
import { ButtonStyle, ContainerUnderTitleStyle, SpaceStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getUserParties } from '../../services/enigmato/enigmatoUserPartiesService'; // Importer le service pour récupérer les parties
import { EnigmatoParty } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';

const EnigmatoHome: React.FC = () => {
  const { t } = useTranslation(); // Déclarer la fonction de traduction
  const navigate = useNavigate();
  const [ongoingGames, setOngoingGames] = useState<EnigmatoParty[]>([]);  // Correction du type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartiesByUser = async () => {
      try {
        setLoading(true);

        // Appel du service pour récupérer les parties en cours
        const games = await getUserParties(navigate);
        if (games!.length === 0) {
          return;
        } else {
          setOngoingGames(games!);  // Sinon, mettre à jour l'état avec les parties récupérées
        }
      } catch (error) {
        setError('Impossible de récupérer les parties en cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartiesByUser();
  }, [navigate]); // Le token est récupéré directement dans useEffect, donc pas besoin de le mettre dans les dépendances.

  // Fonction pour naviguer vers la page EnigmatoParties
  const handleJoinGame = () => {
    navigate('/enigmato/parties');
  };

  // Fonction pour naviguer vers la page de jeu spécifique
  const handleViewGame = (id: number) => {
    navigate(`/enigmato/parties/${id}/game/info`);
  };

  const handleBack = () => {
    navigate(`/home`);
  }

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <HeaderTitleComponent title={t('welcomeenigmato')} onBackClick={handleBack} />
      <ContainerUnderTitleStyle>
        <EnigmatoContainerStyle>
          <Title2Style>{t('game_explanation')}</Title2Style>
          <TextStyle>{t('game_description')}</TextStyle>
          <SpaceStyle />
          <Title2Style>{t('ongoing_games')}</Title2Style>
          {ongoingGames.length === 0 ? (
            <TextStyle>{t('no_ongoing_games')}</TextStyle>
          ) : (
            <>
              {ongoingGames.map((game) => (
                <EnigmatoItemStyle key={game.id_party}>
                  {game.name}
                  <ButtonStyle onClick={() => handleViewGame(game.id_party)}>{t('view')}</ButtonStyle>
                </EnigmatoItemStyle>
              ))}
            </>
          )}
          <ButtonStyle style={{ width: '100%' }} onClick={handleJoinGame}>{t('join_game')}</ButtonStyle>
        </EnigmatoContainerStyle>
      </ContainerUnderTitleStyle>
    </>
  );
};

export default EnigmatoHome;