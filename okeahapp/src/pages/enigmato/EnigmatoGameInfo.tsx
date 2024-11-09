// pages/EnigmatoGameInfo.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { Container, Title, DateContainer, PreviousDaysContainer, PreviousDayItem } from '../../styles/EnigmatoStyles';

const exampleParties = [
    { id: 1, name: 'Partie 1', date: new Date('2023-11-01') },
    { id: 2, name: 'Partie 2', date: new Date('2023-10-30') },
];

const EnigmatoGameInfo: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [partyName, setPartyName] = useState('');
    const [previousDays, setPreviousDays] = useState<any[]>([]);

    useEffect(() => {
        if (id_party) { // Vérifiez si id_party est défini
            const currentParty = exampleParties.find(party => party.id === parseInt(id_party));
            if (currentParty) {
                setPartyName(currentParty.name);
                const today = new Date();
                const pastParties = exampleParties.filter(party => party.date < today);
                setPreviousDays(pastParties);
            }
        } else {
            console.error("id_party is undefined");
        }
    }, [id_party]);

    const handleInfo = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/profil/`);
        }
    };

    const handlePlay = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/game`);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Container>
            <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
            <Title>{partyName}</Title>
            <ButtonStyle onClick={handleInfo}>Information de la partie</ButtonStyle>
            
            <DateContainer>
                <p>Date du jour: {new Date().toLocaleDateString()}</p>
                <ButtonStyle onClick={handlePlay}>Jouer</ButtonStyle>
            </DateContainer>
            
            {previousDays.length > 0 && (
                <PreviousDaysContainer>
                    <h2>Autres jours</h2>
                    {previousDays.map((day) => (
                        <PreviousDayItem key={day.id}>
                            {day.name} - {day.date.toLocaleDateString()}
                        </PreviousDayItem>
                    ))}
                </PreviousDaysContainer>
            )}
        </Container>
    );
};

export default EnigmatoGameInfo;