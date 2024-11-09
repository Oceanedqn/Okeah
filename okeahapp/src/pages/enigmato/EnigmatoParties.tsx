import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ModalContent, ModalOverlay, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { getOngoingParties } from '../../services/enigmato/enigmatoPartiesService';
import { EnigmatoParty } from '../../interfaces/IEnigmato';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';

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
                const partiesData = await getOngoingParties();
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
        return <div>{t('loading')}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <HeaderTitleComponent title='partiesList' onBackClick={handleBack}/>
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