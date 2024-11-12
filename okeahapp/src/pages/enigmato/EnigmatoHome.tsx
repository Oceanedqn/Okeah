import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ButtonStyle, ContainerUnderTitleStyle, SpaceStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getUserParties } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile } from '../../services/enigmato/enigmatoProfileService'; // Importer la fonction pour récupérer le profil
import { IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { calculateGameStage } from '../../utils/utils';

const EnigmatoHome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ongoingGames, setOngoingGames] = useState<IEnigmatoParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<IEnigmatoProfil | null>(null); // État pour le profil

  useEffect(() => {
    const fetchPartiesByUser = async () => {
      try {
        setLoading(true);
        const games = await getUserParties(navigate);
        if (games!.length === 0) {
          return;
        } else {
          setOngoingGames(games!);
        }
      } catch (error) {
        setError('Impossible de récupérer les parties en cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartiesByUser();
  }, [navigate]);

  const fetchUserProfile = async (id_party: number) => {
    try {
      const profile = await fetchProfile(id_party, navigate); // Récupérer le profil de l'utilisateur
      console.log(profile)
      setUserProfile(profile);
      if (profile && !profile.is_complete) {
        navigate(`/enigmato/parties/${id_party}/profil`); // Redirection vers la page de profil si le profil est incomplet
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  const handleJoinNewGame = () => {
    {
      navigate('/enigmato/parties');
    }
  };

  const handleViewGame = (id: number) => {
    // Vérification si le profil est complet avant de permettre la navigation
    if (userProfile && userProfile.is_complete) {
      navigate(`/enigmato/parties/${id}/game/info`);
    } else {
      fetchUserProfile(id); // Vérifier le profil avant d'accéder à la page de jeu
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
            ongoingGames.map((game) => (
              <EnigmatoItemStyle key={game.id_party}>
                <TextStyle>{game.name}</TextStyle>
                {calculateGameStage(game, t)}
                <ButtonStyle onClick={() => handleViewGame(game.id_party)}>{t('view')}</ButtonStyle>
              </EnigmatoItemStyle>
            ))
          )}
          <ButtonStyle style={{ width: '100%' }} onClick={() => handleJoinNewGame()}>{t('join_game')}</ButtonStyle>
        </EnigmatoContainerStyle>
      </ContainerUnderTitleStyle>
    </>
  );
};

export default EnigmatoHome;