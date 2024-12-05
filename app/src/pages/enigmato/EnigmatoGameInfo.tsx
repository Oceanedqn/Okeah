import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ContainerBackgroundStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { IEnigmatoBox, IEnigmatoBoxResponse, IEnigmatoBoxRightResponse, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import { getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
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
                    const fetchedBox = await getTodayBoxAsync(parseInt(id_party), navigate);
                    if (fetchedBox) {
                        setTodayBox(fetchedBox);
                    }
                } catch (error) {
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
    }, [id_party, navigate]);

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

        // Vérifier si todayBox est défini avant d'effectuer la vérification
        if (todayBox) {
            checkIfResponse();
        }
    }, [todayBox, navigate]);

    const handleInfo = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/profil`);
        }
    };

    const handlePlay = () => {
        if (id_party) {
            // check if already response, check if hint used
            navigate(`/enigmato/parties/${id_party}/game`);
        }
    };

    const handleBack = () => {
        navigate(`/enigmato/home`);
    };

    if (!party || !userProfile) {
        return <LoadingComponent />
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
                        {boxResponse ? (
                            <div>
                                <TextStyle>{t("response")}</TextStyle>
                                <TextStyle>{t("choosen_response")} {boxResponse.id_user_response}</TextStyle>
                            </div>
                        ) : (
                            todayBox ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <TextStyle>{formatDate(todayBox.date!)}</TextStyle>
                                    <TextStyle style={{ marginTop: "10px", marginBottom: "10px" }}>{t("time_to_play")}</TextStyle>
                                    <ButtonStyle onClick={handlePlay}>{t("view")}</ButtonStyle>
                                </div>
                            ) : (
                                <TextStyle>{t("nothing_box")}</TextStyle>
                            )
                        )}
                    </ContainerBackgroundStyle>
                    {beforeBoxes && (
                        <>
                            <Title2Style>{t("other_days")}</Title2Style>

                            <ContainerBackgroundStyle>
                                {beforeBoxes.map((box) => (
                                    <div key={box.id_box} style={{ marginBottom: "20px" }}>
                                        {/* Nom et Date de la boîte */}
                                        <p>
                                            <strong>{box.name_box}</strong> - {new Date(box.date).toLocaleDateString()}
                                        </p>

                                        {/* Nom et prénom de l'utilisateur */}
                                        <p>
                                            {t("user_name")}: {box.name} {box.firstname}
                                        </p>

                                        {/* Image 1 si elle est valide */}
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

                                        {/* Image 2 si elle est valide */}
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