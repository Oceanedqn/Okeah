import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ContainerBackgroundStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { IEnigmatoBox, IEnigmatoBoxResponse, IEnigmatoBoxRightResponse, IEnigmatoParticipants, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import { fetchParticipantByIdAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile } from '../../services/enigmato/enigmatoProfileService';
import { getBeforeBoxAsync, getTodayBoxAsync } from '../../services/enigmato/enigmatoBoxesService';
import { getBoxResponseByIdBoxAsync } from '../../services/enigmato/enigmatoBoxResponsesService';
import { useTranslation } from 'react-i18next';
import LoadingComponent from '../../components/base/LoadingComponent';
import { formatDate } from 'src/utils/utils';

const EnigmatoGameInfo: React.FC = () => {
    const { t } = useTranslation();
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [party, setParty] = useState<IEnigmatoParty | null>(null);
    const [todayBox, setTodayBox] = useState<IEnigmatoBox | null>(null);
    const [userProfile, setUserProfile] = useState<IEnigmatoProfil | null>(null);
    const [beforeBoxes, setBeforeBoxes] = useState<IEnigmatoBoxRightResponse[] | null>(null);
    const [boxResponse, setBoxResponse] = useState<IEnigmatoBoxResponse>();
    const [message, setMessage] = useState<string | null>(null);
    const [participant, setParticipant] = useState<IEnigmatoParticipants>();

    // Vérifie si une chaîne est en base64 pour les images
    const isBase64 = (str: string) => /^data:image\/[a-z]+;base64,/.test(str);

    useEffect(() => {
        if (id_party) {
            const fetchUserProfile = async () => {
                try {
                    const profile = await fetchProfile(parseInt(id_party), navigate);
                    setUserProfile(profile);
                    if (profile && !profile.is_complete) {
                        navigate(`/enigmato/parties/${id_party}/profil`);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du profil :", error);
                }
            };

            const fetchParty = async () => {
                try {
                    const fetchedParty = await getPartyAsync(parseInt(id_party), navigate);
                    if (fetchedParty) {
                        setParty(fetchedParty);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données de la partie :", error);
                }
            };

            const fetchTodayBox = async () => {
                try {
                    const response = await getTodayBoxAsync(parseInt(id_party), navigate);
                    if (response && response.status === 202) {
                        setMessage(t("gameStartsTomorrow"));
                    } else if (response && response.data) {
                        setTodayBox(response.data);
                    }
                } catch (error: any) {
                    console.error("Erreur lors de la récupération des données de la partie :", error);
                }
            };

            const fetchBeforeBox = async () => {
                try {
                    const fetchedBeforeBoxes = await getBeforeBoxAsync(parseInt(id_party), navigate);
                    if (fetchedBeforeBoxes) {
                        setBeforeBoxes(fetchedBeforeBoxes);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des anciennes boxes :", error);
                }
            };

            // Appeler toutes les fonctions de récupération des données
            fetchParty();
            fetchUserProfile();
            fetchTodayBox();
            fetchBeforeBox();
        } else {
            console.error("id_party est indéfini");
        }
    }, [id_party, navigate, t]);

    // Deuxième useEffect pour vérifier si la réponse a été donnée, mais seulement lorsque todayBox est défini
    useEffect(() => {
        const checkIfResponse = async () => {
            try {
                if (todayBox?.id_box) {
                    const boxResponse: IEnigmatoBoxResponse = await getBoxResponseByIdBoxAsync(todayBox.id_box, navigate);
                    if (boxResponse.id_user_response) {
                        setBoxResponse(boxResponse);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des anciennes boxes :", error);
            }
        };

        if (todayBox) {
            checkIfResponse();
        }
    }, [todayBox, navigate]);


    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                if (boxResponse?.id_user_response) {
                    const participantRequest: IEnigmatoParticipants = await fetchParticipantByIdAsync(parseInt(id_party!), boxResponse?.id_user_response!, navigate)
                    setParticipant(participantRequest);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du participant :", error);
            }
        }

        if (boxResponse) {
            fetchParticipant();
        }
    }, [boxResponse, navigate]);

    const handleInfo = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/profil`);
        }
    };

    const handlePlay = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/game`);
        }
    };

    const handleBack = () => {
        navigate(`/enigmato/home`);
    };

    if (!party || !userProfile) {
        return <LoadingComponent />;
    }

    return (
        <>
            <HeaderTitleComponent title={party.name} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ButtonStyle onClick={handleInfo}>
                        {t("infoGame")}
                    </ButtonStyle>
                    <ContainerBackgroundStyle>
                        {message && <TextStyle>{message}</TextStyle>}
                        {/* Message or box response */}
                        {message ? (
                            <TextStyle>{message}</TextStyle>
                        ) : boxResponse ? (
                            <div
                                style={{
                                    display: 'flex', // Use flexbox
                                    flexDirection: 'column', // Arrange elements in a column
                                    alignItems: 'center', // Center elements horizontally
                                    textAlign: 'center', // Center text within the div
                                }}
                            >
                                <TextStyle>{t('choosen_response')}</TextStyle>
                                <TextStyle>{participant?.firstname} {participant?.name}</TextStyle>
                                {participant?.picture2 && isBase64(participant.picture2) && (
                                    <img
                                        src={participant.picture2}
                                        alt={`${participant.name} ${participant.firstname}`}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '18px',
                                            objectFit: 'cover',
                                            display: 'block', // Permet d'utiliser margin auto
                                            margin: 'auto', // Centre horizontalement
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            !message && todayBox && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <TextStyle>{formatDate(todayBox.date!)}</TextStyle>
                                    <TextStyle style={{ marginTop: "10px", marginBottom: "10px" }}>{t("time_to_play")}</TextStyle>
                                    <ButtonStyle onClick={handlePlay}>{t("view")}</ButtonStyle>
                                </div>
                            )
                        )}
                        {!message && !todayBox && <TextStyle>{t("nothing_box")}</TextStyle>}
                    </ContainerBackgroundStyle>
                    {beforeBoxes && (
                        <>
                            <Title2Style>{t("other_days")}</Title2Style>

                            <ContainerBackgroundStyle>
                                {beforeBoxes.map((box) => (
                                    <div key={box.id_box} style={{ marginBottom: "20px" }}>
                                        <p>
                                            <strong>{box.name_box}</strong> - {new Date(box.date).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {t("user_name")}: {box.name} {box.firstname}
                                        </p>

                                        {box.picture1 && isBase64(box.picture1) && (
                                            <img
                                                src={box.picture1}
                                                alt="Bebe"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    marginRight: "10px",
                                                }}
                                            />
                                        )}

                                        {box.picture2 && isBase64(box.picture2) && (
                                            <img
                                                src={box.picture2}
                                                alt="Adulte"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </ContainerBackgroundStyle>
                        </>
                    )}

                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoGameInfo;