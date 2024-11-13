import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ButtonStyle, ContainerUnderTitleStyle, SpaceStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getUserPartiesAsync } from '../../services/enigmato/enigmatoPartiesService';
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
  const [isFetchingProfile, setIsFetchingProfile] = useState(false); // Nouvel état pour éviter les appels répétés


  useEffect(() => {
    const fetchPartiesByUser = async () => {
      try {
        setLoading(true);
        const games = await getUserPartiesAsync(navigate);
        if (games?.length) setOngoingGames(games);
      } catch {
        setError(t('error_fetching_games'));
      } finally {
        setLoading(false);
      }
    };

    fetchPartiesByUser();
  }, [navigate, t]);


  const fetchUserProfile = useCallback(async (id_party: number) => {
    if (isFetchingProfile) return;
    setIsFetchingProfile(true);

    try {
      const profile = await fetchProfile(id_party, navigate);
      setUserProfile(profile);
      const path = profile && !profile.is_complete ? `/enigmato/parties/${id_party}/profil` : `/enigmato/parties/${id_party}/game/info`;
      navigate(path);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setIsFetchingProfile(false);
    }
  }, [isFetchingProfile, navigate]);


  const handleViewGame = (id: number) => {
    userProfile?.is_complete ? navigate(`/enigmato/parties/${id}/game/info`) : fetchUserProfile(id);
  };


  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <HeaderTitleComponent title={t('welcomeenigmato')} onBackClick={() => navigate(-1)} />
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
          <ButtonStyle style={{ width: '100%' }} onClick={() => navigate('/enigmato/parties')}>{t('join_game')}</ButtonStyle>
        </EnigmatoContainerStyle>
      </ContainerUnderTitleStyle>
    </>
  );
};

export default EnigmatoHome;