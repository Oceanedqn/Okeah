import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ModalContent, ModalOverlay, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getParties } from '../../services/enigmato/enigmatoPartiesService';
import { EnigmatoJoinParty, EnigmatoParty } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { joinParty } from '../../services/enigmato/enigmatoUserPartiesService'; // Importer la fonction de service

const EnigmatoParties: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
                const partiesData = await getParties();
                setParties(partiesData);
            } catch (error) {
                setError("Impossible de récupérer les parties en cours.");
            } finally {
                setLoading(false);
            }
        };

        fetchParties();
    }, [t]);

    // Gère le clic sur le bouton retour
    const handleBack = () => {
        navigate('/enigmato/home');
    };

    // Gère le clic sur le bouton "Rejoindre"
    const handleJoin = (partie: EnigmatoParty) => {
        if (partie.password) {
            console.log("Mot de passe requis pour rejoindre la partie", partie.password);
            setSelectedPartie(partie);
            setIsModalOpen(true);
        } else {
            console.log("Pas de mot de passe requis");
            joinAndNavigate(partie.id_party,); // Passer l'ID de l'utilisateur actuel
        }
    };


    // Gère la soumission du mot de passe et la requête pour lier l'utilisateur à la partie
    const handleSubmitPassword = async () => {
        if (!password && selectedPartie?.password) {
            setError("Veuillez entrer un mot de passe.");
            return; // Si un mot de passe est requis et vide, on arrête la soumission
        }

        setIsModalOpen(false);

        // Vérification de `selectedPartie` avant d'appeler `joinAndNavigate`
        if (selectedPartie?.id_party) {
            await joinAndNavigate(selectedPartie.id_party, password);  // Envoyer le mot de passe si nécessaire
        } else {
            setError("ID de la partie invalide.");
        }
    };




    // Fonction pour rejoindre une partie
    const joinAndNavigate = async (partyId: number, password?: string) => {
        const joinPartyData: EnigmatoJoinParty = {
            id_party: partyId,
            password: password,  // Le mot de passe est optionnel
        };

        try {
            // Envoi de la requête pour lier l'utilisateur à la partie
            await joinParty(joinPartyData); // Remplacer par la fonction de service appropriée
            navigate(`/enigmato/parties/${partyId}/profil/`); // Rediriger vers la page de la partie
        } catch (error) {
            setError("Impossible de rejoindre la partie.");
        }
    };

    if (loading) {
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <HeaderTitleComponent title='partiesList' onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                {parties.length === 0 ? (
                    <div>{t('noParties')}</div>
                ) : (
                    <EnigmatoContainerStyle>
                        {parties.map((partie) => (
                            <EnigmatoItemStyle key={partie.id_party}>
                                <span>{partie.name}</span>
                                <ButtonStyle onClick={() => handleJoin(partie)}>{t('join')}</ButtonStyle>
                            </EnigmatoItemStyle>
                        ))}
                    </EnigmatoContainerStyle>
                )}

                {/* Modal pour le mot de passe */}
                {isModalOpen && (
                    <ModalOverlay>
                        <ModalContent>
                            <h3>{t('enterPasswordFor')} {selectedPartie?.name}</h3>
                            <input
                                type="password"
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <ButtonStyle onClick={handleSubmitPassword}>{t('validate')}</ButtonStyle>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoParties;