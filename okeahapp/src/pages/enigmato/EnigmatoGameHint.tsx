import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, Title1Style } from '../../styles/GlobalStyles';
import { Container } from '@mui/material';
import { fetchCompletedParticipantsAsync, fetchCompletedRandomParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { getTodayBoxGameAsync } from '../../services/enigmato/enigmatoBoxesService';
import { IEnigmatoBoxGame, IEnigmatoBoxResponse, IEnigmatoParticipants, IEnigmatoParty } from '../../interfaces/IEnigmato';
import { getBoxResponseByIdBoxAsync, updateBoxResponseAsync } from '../../services/enigmato/enigmatoBoxResponsesService';

const EnigmatoGameHint: React.FC = () => {
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


    useEffect(() => {
        if (todayBox && id_party) {
            const fetchResponseBox = async () => {
                try {
                    const boxResponse: IEnigmatoBoxResponse = await getBoxResponseByIdBoxAsync(todayBox?.id_box!, navigate);

                    if (!boxResponse.cluse_used) {
                        navigate(`/enigmato/parties/${id_party}/game`);
                    } else {
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

                        const fetchParticipants = async () => {
                            try {
                                const participantsList = await fetchCompletedRandomParticipantsAsync(parseInt(id_party), navigate);
                                setParticipants(participantsList);
                            } catch (error) {
                                console.error("Erreur lors de la récupération des participants :", error);
                            }
                        };
                        fetchParty();
                        fetchParticipants();
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des réponses de la box :", error);
                }
            };

            fetchResponseBox();
        }
    }, [todayBox, id_party, navigate]);



    const handleBack = () => {
        navigate(-1);
    };

    const handleOptionClick = (participant: IEnigmatoParticipants) => {
        setSelectedParticipant(participant);  // Mettre à jour le participant sélectionné
    };

    const handleValidateChoice = async () => {
        if (selectedParticipant && todayBox) {
            await updateBoxResponseAsync(todayBox?.id_box, selectedParticipant.id_user, navigate);
            navigate(-1);
        } else {
            alert('Veuillez sélectionner un participant.');
        }
    };

    const isBase64 = (str: string) => {
        const regex = /^data:image\/[a-z]+;base64,/;
        return regex.test(str);
    };

    return (
        <Container>
            <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
            <Title1Style>Information de la partie {party?.name}</Title1Style>

            <Container>
                <h2>{todayBox?.name}</h2>

                {/* Render image if it's a valid base64 string */}
                {todayBox?.picture1 && isBase64(todayBox.picture1) ? (
                    <img
                        src={todayBox.picture1}
                        alt="Image du mystère"
                        style={{ width: '150px', height: 'auto', objectFit: 'cover' }}
                    />
                ) : (
                    <div>No image available</div>
                )}

                <div>
                    <h3>Participants proposés :</h3>
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
            </Container>
        </Container>
    );
};

export default EnigmatoGameHint;