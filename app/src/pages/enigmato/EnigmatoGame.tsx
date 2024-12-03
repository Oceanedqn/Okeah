import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextAlertStyle, TextStyle } from '../../styles/GlobalStyles';
import { AutoCompleteContainer, ButtonHintStyle, ContainerBackgroundStyle, EnigmatoContainerStyle } from '../../styles/EnigmatoStyles';
import { Box, Modal } from '@mui/material';
import { fetchCompletedParticipantsAsync, getPartyNameAsync } from '../../services/enigmato/enigmatoPartiesService';
import { getTodayBoxGameAsync } from '../../services/enigmato/enigmatoBoxesService';
import { IEnigmatoBoxGame, IEnigmatoBoxResponse, IEnigmatoParticipants, IEnigmatoParty } from '../../interfaces/IEnigmato';
import { createBoxResponseAsync, getBoxResponseByIdBoxAsync } from '../../services/enigmato/enigmatoBoxResponsesService';
import { useTranslation } from 'react-i18next';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import LoadingComponent from '../../components/base/LoadingComponent';
import ParticipantsGridComponent from 'src/components/Enigmato/ParticipantGridComponent';

const EnigmatoGame: React.FC = () => {
    const { t } = useTranslation();
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<IEnigmatoParticipants[] | null>(null);
    const [todayBox, setTodayBox] = useState<IEnigmatoBoxGame | null>(null);
    const [partyName, setPartyName] = useState<IEnigmatoParty | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<IEnigmatoParticipants | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
                    if (boxResponse.id_user_response) {
                        navigate(`/enigmato/parties/${id_party}/game/info`);
                    }
                    if (boxResponse.cluse_used) {
                        navigate(`/enigmato/parties/${id_party}/game/hint`);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des réponses de la box :", error);
                }
                const fetchParty = async () => {
                    try {
                        const fetchedPartyName = await getPartyNameAsync(parseInt(id_party), navigate);
                        if (fetchedPartyName) {
                            setPartyName(fetchedPartyName);
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération des données de la partie :", error);
                    }
                };

                const fetchParticipants = async () => {
                    try {
                        const participantsList = await fetchCompletedParticipantsAsync(parseInt(id_party), navigate);
                        setParticipants(participantsList);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des participants :", error);
                    }
                };

                fetchParty();
                fetchParticipants();
            };

            fetchResponseBox();
        }
    }, [todayBox, id_party, navigate]);

    const handleBack = () => {
        navigate(`/enigmato/parties/${id_party}/game/info`);
    };

    const handleNeedHint = async () => {
        const boxResponse: IEnigmatoBoxResponse = {
            id_box_response: null,
            id_box: todayBox?.id_box!,
            id_user: null,
            id_user_response: null,
            cluse_used: true
        };
        try {
            const createdResponse = await createBoxResponseAsync(boxResponse, navigate);
            if (createdResponse && createdResponse.id_box_response) {
                navigate(`/enigmato/parties/${id_party}/game/hint`);
            } else {
                alert("Failed to create a box response. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred while creating the box response:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const handleValidateChoice = async () => {
        if (selectedParticipant) {
            const boxResponse: IEnigmatoBoxResponse = {
                id_box_response: null,
                id_box: todayBox?.id_box!,
                id_user: null,
                id_user_response: selectedParticipant.id_user,
                cluse_used: false
            };

            await createBoxResponseAsync(boxResponse, navigate);
            navigate(`/enigmato/parties/${id_party}/game/info`);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleOptionClick = (participant: IEnigmatoParticipants) => {
        setSelectedParticipant(participant);
    };

    const filteredParticipants = participants?.filter((participant) =>
        participant.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        participant.firstname.toLowerCase().includes(inputValue.toLowerCase())
    );

    const isBase64 = (str: string) => {
        const regex = /^data:image\/[a-z]+;base64,/;
        return regex.test(str);
    };


    if (!partyName || !todayBox) {
        return <LoadingComponent />;
    }


    return (
        <>
            <HeaderTitleComponent title={todayBox!.name} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    {todayBox.picture1 && isBase64(todayBox.picture1) && (
                        <img
                            src={todayBox.picture1}
                            alt="mystère"
                            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '32px' }}
                        />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AutoCompleteContainer ref={dropdownRef} style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={inputValue}
                                onFocus={() => { setSelectedParticipant(null); setInputValue(''); }} // Open dropdown on focus
                                onChange={handleInputChange}
                                placeholder={t("searchwhois")}
                            />
                        </AutoCompleteContainer>

                        {/* Button with "?" icon */}
                        <ButtonHintStyle onClick={handleOpenModal}>
                            ?
                        </ButtonHintStyle>
                    </div>
                </EnigmatoContainerStyle>

                <div>
                    <ParticipantsGridComponent
                        participants={filteredParticipants!}
                        selectedParticipant={selectedParticipant}
                        onParticipantClick={handleOptionClick}
                    />
                </div>
                <EnigmatoContainerStyle style={{ paddingTop: '20px' }}>
                    <ButtonStyle onClick={handleValidateChoice} disabled={!selectedParticipant}>{t("validate_choice")}</ButtonStyle>
                </EnigmatoContainerStyle>

            </ContainerUnderTitleStyle>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center'
                    }}
                >
                    <TextAlertStyle>{t("continue_help")}</TextAlertStyle>
                    <div style={{ marginTop: '16px' }}>
                        <ButtonStyle onClick={handleNeedHint} style={{ marginRight: '8px' }}>{t("yes")}</ButtonStyle>
                        <ButtonStyle onClick={handleCloseModal}>{t("no")}</ButtonStyle>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default EnigmatoGame;