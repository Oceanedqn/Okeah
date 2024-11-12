import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ModalContent, ModalOverlay, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getPartiesAsync, joinParty } from '../../services/enigmato/enigmatoPartiesService';
import { IEnigmatoJoinParty, IEnigmatoParty } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { calculateGameStage } from '../../utils/utils';

const EnigmatoParties: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [parties, setParties] = useState<IEnigmatoParty[]>([]);
    const [selectedPartie, setSelectedPartie] = useState<IEnigmatoParty | null>(null);
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Nouveau état pour gérer la disponibilité des pages suivantes


    useEffect(() => {
        const fetchParties = async () => {
            try {
                setLoading(true);
                const partiesData = await getPartiesAsync(currentPage, 8, navigate);
                setParties(partiesData!);
                setHasMore(partiesData!.length === 10);
            } catch (error) {
                setError("Impossible de récupérer les parties en cours.");
            } finally {
                setLoading(false);
            }
        };

        fetchParties();
    }, [t, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        navigate('/enigmato/home');
    };

    const handleJoin = (partie: IEnigmatoParty) => {
        if (partie.password) {
            setSelectedPartie(partie);
            setIsModalOpen(true);
        } else {
            joinAndNavigate(partie.id_party,);
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
        const joinPartyData: IEnigmatoJoinParty = {
            id_party: partyId,
            password: password,  // Le mot de passe est optionnel
        };

        try {
            // Envoi de la requête pour lier l'utilisateur à la partie
            await joinParty(joinPartyData, navigate); // Remplacer par la fonction de service appropriée
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
                                <TextStyle>{partie.name}</TextStyle>
                                {/* Vérification de set_password */}
                                {partie.set_password && (
                                    <TextStyle>{t('mdp')}</TextStyle>
                                )}
                                {calculateGameStage(partie, t)}
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

                {/* Pagination */}
                <EnigmatoContainerStyle>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <ButtonStyle
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {t('<')}
                        </ButtonStyle>
                        <span>{t('Page')} {currentPage}</span>
                        <ButtonStyle
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasMore}
                        >
                            {t('>')}
                        </ButtonStyle>
                    </div>
                </EnigmatoContainerStyle>

            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoParties;