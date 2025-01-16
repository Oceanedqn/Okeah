import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextDarkStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ContainerBackgroundStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { IEnigmatoBox, IEnigmatoBoxResponse, IEnigmatoBoxRightResponse, IEnigmatoParticipantPercentage, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import { fetchParticipantByIdAsync, fetchParticipantsPourcentagesAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile } from '../../services/enigmato/enigmatoProfileService';
import { getBeforeBoxAsync, getTodayBoxAsync } from '../../services/enigmato/enigmatoBoxesService';
import { getBoxResponseByIdBoxAsync } from '../../services/enigmato/enigmatoBoxResponsesService';
import { useTranslation } from 'react-i18next';
import LoadingComponent from '../../components/base/LoadingComponent';
import { formatDate } from 'src/utils/utils';
import { FaInfoCircle } from "react-icons/fa";

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
    const [participantsPercentages, setParticipantsPercentages] = useState<IEnigmatoParticipantPercentage[]>([]);

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

            fetchParty();
            fetchUserProfile();
        } else {
            console.error("id_party est indéfini");
        }
    }, [id_party, navigate]);

    useEffect(() => {
        if (party && id_party) {
            const fetchTodayBox = async () => {
                try {
                    const response = await getTodayBoxAsync(parseInt(id_party), navigate);
                    if (response && response.status === 202) {
                        if (party.date_start) {
                            setMessage(t("gameStarts") + " " + formatDate(party.date_start));
                        }
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

            fetchTodayBox();
            fetchBeforeBox();
        }
    }, [party, id_party, navigate, t]);

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
        const fetchPercentagesParticipants = async () => {
            try {
                if (boxResponse?.id_user_response) {
                    const participantsPercentagesRequest: IEnigmatoParticipantPercentage[] = await fetchParticipantsPourcentagesAsync(parseInt(id_party!), boxResponse.id_box, navigate);
                    setParticipantsPercentages(participantsPercentagesRequest);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du pourcentage des participants :", error);
            }
        }

        if (boxResponse) {
            fetchPercentagesParticipants();
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

    if (!party || !userProfile || !participantsPercentages) {
        return <LoadingComponent />;
    }

    return (
        <>
            <HeaderTitleComponent title={party.name} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ButtonStyle onClick={handleInfo} className='flex items-center justify-cente'>
                        <FaInfoCircle className='mr-2' />
                        {t("infoGame")}
                        <FaInfoCircle className='ml-2' />
                    </ButtonStyle>
                    <ContainerBackgroundStyle>
                        {message ? (
                            <TextDarkStyle>{message}</TextDarkStyle>
                        ) : boxResponse ? (
                            <div
                                style={{
                                    display: 'flex', // Use flexbox
                                    flexDirection: 'column', // Arrange elements in a column
                                    alignItems: 'center', // Center elements horizontally
                                    textAlign: 'center', // Center text within the div
                                }}
                            >
                                <div><TextStyle>{t('thoughtOf')} <strong>{participantsPercentages.find(p => p.isChoiceByUser)?.firstname} {participantsPercentages.find(p => p.isChoiceByUser)?.name}</strong> {t('like')} <strong>{participantsPercentages.find(p => p.isChoiceByUser)?.percentage}%</strong> {t('ofPeople')}</TextStyle></div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center', marginTop: '20px' }}>
                                    {/* Left image (2nd place) */}
                                    <div style={{ textAlign: 'center', marginRight: '10px' }}>
                                        {participantsPercentages[1]?.picture2 && isBase64(participantsPercentages[1]?.picture2) && (
                                            <>
                                                <img
                                                    src={participantsPercentages[1]?.picture2}
                                                    alt={`${participantsPercentages[1]?.name} ${participantsPercentages[1]?.firstname}`}
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        borderRadius: '12px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <TextStyle className='mt-2'>{participantsPercentages[1]?.percentage}%</TextStyle>
                                            </>
                                        )}
                                    </div>

                                    {/* Middle image (1st place) */}
                                    <div style={{ textAlign: 'center', margin: '0 10px' }}>
                                        {participantsPercentages[0]?.picture2 && isBase64(participantsPercentages[0]?.picture2) && (
                                            <>
                                                <img
                                                    src={participantsPercentages[0]?.picture2}
                                                    alt={`${participantsPercentages[0]?.name} ${participantsPercentages[0]?.firstname}`}
                                                    style={{
                                                        width: '200px',
                                                        height: '200px',
                                                        borderRadius: '18px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <TextStyle className='mt-2'>{participantsPercentages[0]?.percentage} %</TextStyle>
                                            </>
                                        )}
                                    </div>

                                    {/* Right image (3rd place) */}
                                    <div style={{ textAlign: 'center', marginLeft: '10px' }}>
                                        {participantsPercentages[2]?.picture2 && isBase64(participantsPercentages[2]?.picture2) && (
                                            <>
                                                <img
                                                    src={participantsPercentages[2]?.picture2}
                                                    alt={`${participantsPercentages[2]?.name} ${participantsPercentages[2]?.firstname}`}
                                                    style={{
                                                        width: '125px',
                                                        height: '125px',
                                                        borderRadius: '10px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <TextStyle className='mt-2'>{participantsPercentages[2]?.percentage} %</TextStyle>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', marginTop: '20px', gap: '5px' }}>
                                    {/* Afficher le reste des images des participants */}
                                    {participantsPercentages.slice(3).map((participant, index) => (
                                        <div key={participant.id_user} style={{ textAlign: 'center', marginBottom: '20px' }}>
                                            {participant.picture2 && isBase64(participant.picture2) && (
                                                <>
                                                    <img
                                                        src={participant.picture2}
                                                        alt={`${participant.name} ${participant.firstname}`}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '10px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <TextStyle className='mt-2'>{participant.percentage}%</TextStyle>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

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
                                    <div key={box.id_box} style={{ marginBottom: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <TextStyle>
                                            <strong>{new Date(box.date).toLocaleDateString()}</strong>
                                        </TextStyle>
                                        <p>
                                            {t("user_name")} {box.name} {box.firstname}
                                        </p>
                                        <div style={{ display: 'flex' }}>
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