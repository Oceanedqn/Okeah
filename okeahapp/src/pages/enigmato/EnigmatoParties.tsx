import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { Container1, ModalContent, ModalOverlay, PartieItem, PartiesContainer, Title1 } from '../../styles/EnigmatoStyles';
import { getOngoingParties } from '../../services/enigmato/enigmatoPartiesService';
import { EnigmatoParty } from '../../interfaces/IEnigmato';

const EnigmatoParties: React.FC = () => {
    const navigate = useNavigate();
    const [parties, setParties] = useState<EnigmatoParty[]>([]);
    const [selectedPartie, setSelectedPartie] = useState<EnigmatoParty | null>(null);
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParties = async () => {
            try {
                setLoading(true);
                const partiesData = await getOngoingParties();
                setParties(partiesData);
            } catch (error) {
                setError("Impossible de récupérer les parties en cours.");
            } finally {
                setLoading(false);
            }
        };

        fetchParties();
    }, []);

    // Gère le clic sur le bouton retour
    const handleBack = () => {
        navigate('/enigmato/home');
    };

    // Gère le clic sur le bouton "Rejoindre"
    const handleJoin = (partie: EnigmatoParty) => {
        if (partie.password) {
            setSelectedPartie(partie);
            setIsModalOpen(true);
        } else {
            navigate(`/enigmato/parties/${partie.id_party}/profil/`);
        }
    };

    // Gère la soumission du mot de passe
    const handleSubmitPassword = () => {
        if (password || !selectedPartie?.password) {
            setIsModalOpen(false);
            navigate(`/enigmato/parties/${selectedPartie?.id_party}/profil/`);
        }
    };

    if (loading) {
        return <div>Chargement des parties...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container1>
            <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
            <Title1>Liste des parties</Title1>
    
            {parties.length === 0 ? (
                <div>Il n'y a pas encore de partie en cours, merci de patienter.</div>
            ) : (
                <PartiesContainer>
                    {parties.map((partie) => (
                        <PartieItem key={partie.id_party}>
                            <span>{partie.name}</span>
                            <ButtonStyle onClick={() => handleJoin(partie)}>Rejoindre</ButtonStyle>
                        </PartieItem>
                    ))}
                </PartiesContainer>
            )}
    
            {/* Modal pour le mot de passe */}
            {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                        <h3>Entrer le mot de passe pour {selectedPartie?.name}</h3>
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