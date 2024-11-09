import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { Container1, ModalContent, ModalOverlay, PartieItem, PartiesContainer, Title, Title1 } from '../../styles/EnigmatoStyles';

interface Partie {
    id: number;
    nom: string;
    hasPassword: boolean;
}

const partiesData: Partie[] = [
    { id: 1, nom: 'Partie 1', hasPassword: false },
    { id: 2, nom: 'Partie 2', hasPassword: true },
    { id: 3, nom: 'Partie 3', hasPassword: true },
];

const EnigmatoParties: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPartie, setSelectedPartie] = useState<Partie | null>(null);
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Gère le clic sur le bouton retour
    const handleBack = () => {
        navigate('/enigmato/home');
    };

    // Gère le clic sur le bouton "Rejoindre"
    const handleJoin = (partie: Partie) => {
        if (partie.hasPassword) {
            setSelectedPartie(partie);
            setIsModalOpen(true);
        } else {
            // navigate(`/enigmato/parties/${id_party}/profil/`);
        }
    };

    // Gère la soumission du mot de passe
    const handleSubmitPassword = () => {
        if (password || !selectedPartie?.hasPassword) {
            setIsModalOpen(false);
            // navigate(`/enigmato/parties/${id_party}/profil/`);
        }
    };

    return (
        <Container1>
            <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
            <Title1>Liste des parties</Title1>
            <PartiesContainer>
                {partiesData.map((partie) => (
                    <PartieItem key={partie.id}>
                        <span>{partie.nom}</span>
                        <ButtonStyle onClick={() => handleJoin(partie)}>Rejoindre</ButtonStyle>
                    </PartieItem>
                ))}
            </PartiesContainer>

            {/* Modal pour le mot de passe */}
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>Entrer le mot de passe pour {selectedPartie?.nom}</h3>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <ButtonStyle onClick={handleSubmitPassword}>Valider</ButtonStyle>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container1>
    );
};

export default EnigmatoParties;