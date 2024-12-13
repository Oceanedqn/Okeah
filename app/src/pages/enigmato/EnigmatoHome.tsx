import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle } from '../../styles/EnigmatoStyles';
import { getUserPartiesAsync, getUserFinishedPartiesAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile } from '../../services/enigmato/enigmatoProfileService'; // Importer la fonction pour récupérer le profil
import { IEnigmatoPartyParticipants, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import EnigmatoItemComponent from '../../components/Enigmato/EnigmatoItemComponent';
import LoadingComponent from '../../components/base/LoadingComponent';

const EnigmatoHome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ongoingGames, setOngoingGames] = useState<IEnigmatoPartyParticipants[]>([]);
  const [finishedGames, setFinishedGames] = useState<IEnigmatoPartyParticipants[]>([]);
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


  useEffect(() => {
    const fetchFinishedPartiesByUser = async () => {
      try {
        setLoading(true);
        const games = await getUserFinishedPartiesAsync(navigate);
        if (games?.length) setFinishedGames(games);
      } catch {
        setError(t('error_fetching_games_finished'));
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedPartiesByUser();
  }, [ongoingGames, navigate, t]);


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

  const returnGameExplanation = () => {
    return <>
      <Title2Style>{t('game_explanation')}</Title2Style>
      <TextStyle>{t('game_description')}</TextStyle>
      {ongoingGames.length === 0 && (
        <ButtonStyle style={{ width: "100%", marginTop: "16px" }} onClick={() => navigate('/enigmato/parties')}>{t('join_game')}</ButtonStyle>
      )}

    </>
  }

  const checkIfInfo = () => {
    if (ongoingGames.length === 0) {
      return null
    } else {
      return returnGameExplanation();
    }
  }


  if (loading) return <LoadingComponent />
  if (error) return <div>{error}</div>;

  return (
    <>
      <HeaderTitleComponent title={t('welcomeenigmato')} onBackClick={() => navigate("/home")} info={checkIfInfo()} />
      {ongoingGames.length === 0 && (
        <EnigmatoContainerStyle>
          <img src="/assets/guess_who.jpg" alt="Guess Who" style={{ width: "50%", maxWidth: "400px", marginBottom: "16px", borderRadius: "32px" }} />
        </EnigmatoContainerStyle>
      )}

      <ContainerUnderTitleStyle>
        <EnigmatoContainerStyle style={{ marginBottom: "32px" }}>{ongoingGames.length === 0 ? returnGameExplanation() : null}</EnigmatoContainerStyle>

        {ongoingGames.length > 0 && (
          <EnigmatoContainerStyle style={{ marginBottom: "15px" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Title2Style>{t('ongoing_games')}</Title2Style>
              <ButtonStyle onClick={() => navigate('/enigmato/parties')}>{t('join_game')}</ButtonStyle>
            </div>

            {ongoingGames.map((game) => (
              <EnigmatoItemComponent key={game.id_party} game={game} handleViewGame={handleViewGame} />
            ))}
          </EnigmatoContainerStyle>
        )}


        {finishedGames.length > 0 && (
          <EnigmatoContainerStyle style={{ marginBottom: "16px", marginTop: "32px" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Title2Style>{t('finished_games')}</Title2Style>
            </div>
            {finishedGames.length === 0 ? (<TextStyle>{t('no_ongoing_games')}</TextStyle>
            ) : (
              finishedGames.map((game) => (<EnigmatoItemComponent key={game.id_party} game={game} handleViewGame={handleViewGame} />))
            )}
          </EnigmatoContainerStyle>
        )}
      </ContainerUnderTitleStyle>
    </>
  );
};

export default EnigmatoHome;