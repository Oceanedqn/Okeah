import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, TitleH3Style } from '../../styles/GlobalStyles';
import { Container, Title, AutoCompleteContainer } from '../../styles/EnigmatoStyles';

// Données simulées pour les participants
const exampleParticipants = [
    { id: 1, name: 'Alice', gender: 'female' },
    { id: 2, name: 'Bob', gender: 'male' },
    { id: 3, name: 'Charlie', gender: 'male' },
    { id: 4, name: 'Diana', gender: 'female' },
    { id: 5, name: 'Eve', gender: 'female' },
    { id: 6, name: 'Frank', gender: 'male' },
    { id: 7, name: 'Grace', gender: 'female' },
    { id: 8, name: 'Hank', gender: 'male' },
    { id: 9, name: 'Ivy', gender: 'female' },
    { id: 10, name: 'Jack', gender: 'male' },
];

// Données simulées pour la boîte
const exampleBox = {
    name: 'Mystère de la boîte 1',
    imageUrl: 'https://example.com/photo1.jpg',
};

const EnigmatoGame: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState(exampleParticipants);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [randomParticipants, setRandomParticipants] = useState<any[]>([]);
    const [showHintUser, setShowHintUser] = useState<any | null>(null);
    const [hintRequested, setHintRequested] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Simuler une fonction qui récupère l'utilisateur associé à l'id_enigma
    const fetchHintUser = () => {
        // Simuler le retour d'un utilisateur
        return exampleParticipants[Math.floor(Math.random() * exampleParticipants.length)];
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleNeedHint = () => {
        const hintUser = fetchHintUser();
        setShowHintUser(hintUser);
        setHintRequested(true);
        setIsDropdownOpen(false);
        setInputValue('');
        if (selectedParticipant) {
            selectRandomParticipants(selectedParticipant);
        }
    };

    const handleValidateChoice = () => {
        if (selectedParticipant) {
            alert(`Choix validé pour le participant: ${selectedParticipant}`);
            navigate(-1);  // Cela vous ramène à la page précédente
        } else {
            alert('Veuillez sélectionner un participant.');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        const filtered = exampleParticipants.filter(participant =>
            participant.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredParticipants(filtered);
    };

    const handleOptionClick = (name: string) => {
        setSelectedParticipant(name);
        setInputValue(name);
        setFilteredParticipants([]);
        setIsDropdownOpen(false);
        selectRandomParticipants(name);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const selectRandomParticipants = (selectedName: string) => {
        const selected = exampleParticipants.find(p => p.name === selectedName);
        if (!selected) return;
    
        const sameGender = exampleParticipants.filter(p => p.gender === selected.gender && p.name !== selectedName);
        const oppositeGender = exampleParticipants.filter(p => p.gender !== selected.gender && p.name !== selectedName);
    
        // On commence avec le participant sélectionné
        const participantsToSelect = [selected];
    
        // Ajout de participants du même genre
        const randomSameGender = sameGender.sort(() => 0.5 - Math.random()).slice(0, 2); // 2 participants du même genre
        participantsToSelect.push(...randomSameGender);
    
        // Compléter avec des participants de l'autre genre si besoin
        const remainingCount = 3 - randomSameGender.length; // On a déjà ajouté 1 + 2 = 3 participants
        const randomOppositeGender = oppositeGender.sort(() => 0.5 - Math.random()).slice(0, remainingCount);
    
        participantsToSelect.push(...randomOppositeGender);
    
        // S'assurer d'avoir exactement 4 participants
        setRandomParticipants(participantsToSelect);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Container>
            <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
            <Title>Information de la partie</Title>

            <Container>
                <h2>{exampleBox.name}</h2>
                <img src={exampleBox.imageUrl} alt={exampleBox.name} style={{ width: '100%', height: 'auto' }} />

                {!hintRequested && (
                    <AutoCompleteContainer ref={dropdownRef}>
                        <input
                            type="text"
                            value={inputValue}
                            onClick={toggleDropdown}
                            onChange={handleInputChange}
                            placeholder="Sélectionner un participant"
                        />
                        {isDropdownOpen && filteredParticipants.length > 0 && (
                            <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                                {filteredParticipants.map(participant => (
                                    <li key={participant.id} onClick={() => handleOptionClick(participant.name)} style={{ cursor: 'pointer' }}>
                                        {participant.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </AutoCompleteContainer>
                )}

                {!hintRequested && (
                    <div>
                        <ButtonStyle onClick={handleNeedHint}>Besoin d'indice</ButtonStyle>
                        <TitleH3Style>Attention : l'indice fait perdre la moitié des points.</TitleH3Style>
                    </div>
                )}

                {hintRequested && (
                    <div>
                        <h3>Participants proposés :</h3>
                        {randomParticipants.length > 0 ? (
                            randomParticipants.map(participant => (
                                <div key={participant.id} style={{ margin: '5px 0' }}>
                                    <span style={{ color: participant.name === selectedParticipant ? 'blue' : 'black' }}>
                                        {participant.name}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p>Aucun participant proposé.</p>
                        )}
                        <TitleH3Style>Utilisateur d'indice : {showHintUser?.name}</TitleH3Style>
                    </div>
                )}

                <ButtonStyle onClick={handleValidateChoice}>Valider mon choix</ButtonStyle>
            </Container>
        </Container>
    );
};

export default EnigmatoGame;