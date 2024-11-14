import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, Title1Style, Title2Style } from '../../styles/GlobalStyles';
import { AutoCompleteContainer } from '../../styles/EnigmatoStyles';
import { Container } from '@mui/material';
import { fetchCompletedParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { getBeforeBoxAsync, getTodayBoxAsync, getTodayBoxGameAsync } from '../../services/enigmato/enigmatoBoxesService';
import { IEnigmatoBox, IEnigmatoBoxGame, IEnigmatoBoxResponse, IEnigmatoBoxRightResponse, IEnigmatoParticipants, IEnigmatoParty } from '../../interfaces/IEnigmato';
import { createBoxResponseAsync } from '../../services/enigmato/enigmatoBoxResponsesService';
import { IUser } from '../../interfaces/IUser';

const EnigmatoGameHint: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();

    const [participants, setParticipants] = useState<IEnigmatoParticipants[] | null>(null);
    const [todayBox, setTodayBox] = useState<IEnigmatoBoxGame | null>(null);
    const [party, setParty] = useState<IEnigmatoParty | null>(null);

    const [selectedParticipant, setSelectedParticipant] = useState<IEnigmatoParticipants | null>(null);

    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [randomParticipants, setRandomParticipants] = useState<any[]>([]);
    const [showHintUser, setShowHintUser] = useState<boolean | null>(null);
    const [hintRequested, setHintRequested] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     if (id_party) {
    //         const fetchParticipants = async () => {
    //             try {
    //                 const participantsList = await fetchCompletedParticipantsAsync(parseInt(id_party), navigate);
    //                 setParticipants(participantsList);
    //             } catch (error) {
    //                 console.error("Erreur lors de la récupération des participants :", error);
    //             }
    //         };

    //         const fetchParty = async () => {
    //             try {
    //                 const fetchedParty = await getPartyAsync(parseInt(id_party), navigate);
    //                 if (fetchedParty) {
    //                     setParty(fetchedParty);
    //                 }
    //             } catch (error) {
    //                 console.error("Erreur lors de la récupération des données de la partie :", error);
    //             }
    //         };

    //         const fetchTodayBox = async () => {
    //             try {
    //                 const fetchedBox = await getTodayBoxGameAsync(parseInt(id_party), navigate);
    //                 if (fetchedBox) {
    //                     setTodayBox(fetchedBox);
    //                 }
    //             } catch (error) {
    //                 console.error("Erreur lors de la récupération des données de la partie :", error);
    //             }
    //         };



    //         fetchParty();
    //         fetchParticipants();
    //         fetchTodayBox();
    //     } else {
    //         console.error("id_party est indéfini");
    //     }
    // }, [id_party, navigate]);

    // const handleBack = () => {
    //     navigate(-1);
    // };

    // const handleNeedHint = () => {
    //     console.log("need hint");
    // };

    // const handleValidateChoice = () => {
    //     if (selectedParticipant) {
    //         const boxResponse: IEnigmatoBoxResponse = {
    //             id_box: todayBox?.id_box!,
    //             id_user: 0,
    //             id_user_response: selectedParticipant.id_user,
    //             cluse_used: showHintUser!
    //         }
    //         await createBoxResponseAsync()
    //         navigate(-1);
    //     } else {
    //         alert('Veuillez sélectionner un participant.');
    //     }
    // };

    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("input change");
    // };

    // const handleOptionClick = (participant: IEnigmatoParticipants) => {
    //     setSelectedParticipant(participant);
    //     setInputValue(participant.name);
    //     setIsDropdownOpen(false);
    // };

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(prev => !prev);
    // };

    // const isBase64 = (str: string) => {
    //     const regex = /^data:image\/[a-z]+;base64,/;
    //     return regex.test(str);
    // };

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setIsDropdownOpen(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    return (
        <></>
        // <Container>
        //     <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
        //     <Title1Style>Information de la partie {party?.name}</Title1Style>

        //     <Container>
        //         <h2>{todayBox?.name}</h2>

        //         {/* Render image if it's a valid base64 string */}
        //         {todayBox?.picture1 && isBase64(todayBox.picture1) ? (
        //             <img
        //                 src={todayBox.picture1}
        //                 alt="Image du mystère"
        //                 style={{ width: '150px', height: 'auto', objectFit: 'cover' }}
        //             />
        //         ) : (
        //             <div>No image available</div>
        //         )}

        //         {!hintRequested && (
        //             <AutoCompleteContainer ref={dropdownRef}>
        //                 <input
        //                     type="text"
        //                     value={inputValue}
        //                     onClick={toggleDropdown}
        //                     onChange={handleInputChange}
        //                     placeholder="Sélectionner un participant"
        //                 />
        //                 {isDropdownOpen && participants!.length > 0 && (
        //                     <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
        //                         {participants!.map(participant => (
        //                             <li key={participant.id_user} onClick={() => handleOptionClick(participant)} style={{ cursor: 'pointer' }}>
        //                                 {participant.name}
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 )}
        //             </AutoCompleteContainer>
        //         )}

        //         {!hintRequested && (
        //             <div>
        //                 <ButtonStyle onClick={handleNeedHint}>Besoin d'indice</ButtonStyle>
        //                 <Title2Style>Attention : l'indice fait perdre la moitié des points.</Title2Style>
        //             </div>
        //         )}

        //         {hintRequested && (
        //             <div>
        //                 <h3>Participants proposés :</h3>
        //                 {randomParticipants.length > 0 ? (
        //                     randomParticipants.map(participant => (
        //                         <button key={participant.id} style={{ margin: '5px 0' }}>
        //                             <span style={{ color: participant.name === selectedParticipant ? 'blue' : 'black' }}>
        //                                 {participant.name}
        //                             </span>
        //                         </button>
        //                     ))
        //                 ) : (
        //                     <p>Aucun participant proposé.</p>
        //                 )}
        //                 <Title2Style>Utilisateur d'indice : {showHintUser?.name}</Title2Style>
        //             </div>
        //         )}

        //         <ButtonStyle onClick={handleValidateChoice}>Valider mon choix</ButtonStyle>
        //     </Container>
        // </Container>
    );
};

export default EnigmatoGameHint;