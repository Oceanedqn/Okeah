import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle } from '../../styles/GlobalStyles';
import { fetchCompletedRandomParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { getTodayBoxGameAsync } from '../../services/enigmato/enigmatoBoxesService';
import { IEnigmatoBoxGame, IEnigmatoBoxResponse, IEnigmatoParticipants, IEnigmatoParty } from '../../interfaces/IEnigmato';
import { getBoxResponseByIdBoxAsync, updateBoxResponseAsync } from '../../services/enigmato/enigmatoBoxResponsesService';
import { useTranslation } from 'react-i18next';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { ContainerBackgroundStyle, EnigmatoContainerStyle } from '../../styles/EnigmatoStyles';
import LoadingComponent from '../../components/base/LoadingComponent';

const EnigmatoGameHint: React.FC = () => {
    const { t } = useTranslation();
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<IEnigmatoParticipants[] | null>(null);
    const [todayBox, setTodayBox] = useState<IEnigmatoBoxGame | null>(null);
    const [boxResponse, setBoxResponse] = useState<IEnigmatoBoxResponse>()
    const [party, setParty] = useState<IEnigmatoParty | null>(null);

    const [selectedParticipant, setSelectedParticipant] = useState<IEnigmatoParticipants | null>(null);

    useEffect(() => {
        if (id_party) {
            const fetchTodayBox = async () => {
                try {
                    const fetchedBox = await getTodayBoxGameAsync(parseInt(id_party), navigate);
                    if (fetchedBox) {
                        setTodayBox(fetchedBox);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données de la partie :", error);
                }
            };
            fetchTodayBox();
        } else {
            console.error("id_party est indéfini");
        }
    }, [id_party, navigate]);


    const handleBack = useCallback(() => {
        navigate(`/enigmato/parties/${id_party}/game/info`);
    }, [navigate, id_party]);

    useEffect(() => {
        if (todayBox && id_party) {
            const fetchResponseBox = async () => {
                try {
                    const response: IEnigmatoBoxResponse = await getBoxResponseByIdBoxAsync(todayBox?.id_box!, navigate);
                    setBoxResponse(response);

                    if (response && response.id_user_response) {
                        handleBack(); // Redirect if an id_user_response exists
                        return; // Stop further execution
                    }

                    if (response && !response.cluse_used) {
                        navigate(`/enigmato/parties/${id_party}/game`);
                    } else {
                        const fetchParty = async () => {
                            try {
                                const fetchedParty = await getPartyAsync(parseInt(id_party), navigate);
                                if (fetchedParty) {
                                    setParty(fetchedParty);
                                }
                            } catch (error) {
                                console.error("Error fetching party data:", error);
                            }
                        };

                        const fetchParticipants = async () => {
                            try {
                                const participantsList = await fetchCompletedRandomParticipantsAsync(parseInt(id_party), navigate);
                                setParticipants(participantsList);
                            } catch (error) {
                                console.error("Error fetching participants:", error);
                            }
                        };
                        fetchParty();
                        fetchParticipants();
                    }
                } catch (error) {
                    console.error("Error fetching box response:", error);
                }
            };

            fetchResponseBox();
        }
    }, [todayBox, id_party, navigate, handleBack]); // Add handleBack





    const handleOptionClick = (participant: IEnigmatoParticipants) => {
        console.log(participant)
        setSelectedParticipant(participant);  // Mettre à jour le participant sélectionné
    };

    const handleValidateChoice = async () => {
        console.log(selectedParticipant)
        console.log(boxResponse)
        if (selectedParticipant && boxResponse && boxResponse.id_box_response) {
            await updateBoxResponseAsync(boxResponse.id_box_response, selectedParticipant.id_user, navigate);
            handleBack();
        } else {
            alert('Veuillez sélectionner un participant.'); // todo griser le bouton si personne de selectionnee
        }
    };

    const isBase64 = (str: string) => {
        const regex = /^data:image\/[a-z]+;base64,/;
        return regex.test(str);
    };

    if (!party) return <LoadingComponent />

    return (
        <>
            <HeaderTitleComponent title={t("infoGame") + " " + party.name} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ContainerBackgroundStyle>
                        <h2>{todayBox?.name}</h2>

                        {/* Render image if it's a valid base64 string */}
                        {todayBox?.picture1 && isBase64(todayBox.picture1) ? (
                            <img
                                src={todayBox.picture1}
                                alt="mystère"
                                style={{ width: '150px', height: 'auto', objectFit: 'cover' }}
                            />
                        ) : (
                            <div>No image available</div>
                        )}


                        <div>
                            <TextStyle style={{ marginTop: "20px" }}>Participants proposés :</TextStyle>
                            {participants && participants.length > 0 ? (
                                participants.map(participant => (
                                    <button
                                        key={participant.id_user}
                                        style={{
                                            margin: '5px 0',
                                            backgroundColor: selectedParticipant?.id_user === participant.id_user ? 'blue' : 'transparent',
                                            color: selectedParticipant?.id_user === participant.id_user ? 'white' : 'black',
                                            cursor: 'pointer',
                                            padding: '5px 10px',
                                        }}
                                        onClick={() => handleOptionClick(participant)}
                                    >
                                        {participant.name}
                                    </button>
                                ))
                            ) : (
                                <p>Aucun participant proposé.</p>
                            )}
                        </div>

                        <ButtonStyle onClick={handleValidateChoice}>Valider mon choix</ButtonStyle>
                    </ContainerBackgroundStyle>


                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>

    );
};

export default EnigmatoGameHint;