import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, Title2Style } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, ContainerBackgroundStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { IEnigmatoBox, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import { getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile } from '../../services/enigmato/enigmatoProfileService'; // Assurez-vous d'importer cette fonction

const EnigmatoGameInfo: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [party, setParty] = useState<IEnigmatoParty | null>(null); // Initialise party à null
    const [todayBox, setTodayBox] = useState<IEnigmatoBox | null>(null);
    const [userProfile, setUserProfile] = useState<IEnigmatoProfil | null>(null); // Pour stocker le profil

    useEffect(() => {
        if (id_party) {
            // Récupération de la partie
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

            // Vérification du profil de l'utilisateur avant de charger la partie
            const fetchUserProfile = async () => {
                try {
                    const profile = await fetchProfile(parseInt(id_party), navigate);
                    setUserProfile(profile);
                    if (profile && !profile.is_complete) {
                        // Si le profil est incomplet, redirige vers la page de profil
                        navigate(`/enigmato/parties/${id_party}/profil`);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du profil :", error);
                }
            };

            fetchParty();
            fetchUserProfile(); // Récupère et vérifie le profil à chaque fois qu'on entre sur la page
        } else {
            console.error("id_party est indéfini");
        }
    }, [id_party, navigate]);

    const handleInfo = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/profil`);
        }
    };

    const handlePlay = () => {
        if (id_party) {
            navigate(`/enigmato/parties/${id_party}/game`);
        }
    };

    const handleBack = () => {
        navigate(`/enigmato/home`);
    };

    // Affichage de chargement tant que la partie ou le profil n'est pas chargé
    if (!party || !userProfile) {
        return <p>Chargement des informations...</p>;
    }

    return (
        <>
            <HeaderTitleComponent title={party.name} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ButtonStyle onClick={handleInfo}>Information de la partie</ButtonStyle>
                    <ContainerBackgroundStyle>
                        {/* Affiche le box du jour ou un message si non disponible */}
                        {todayBox ? (
                            <div>
                                <p>Box du jour: {todayBox.name}</p>
                                <ButtonStyle onClick={handlePlay}>Jouer</ButtonStyle>
                            </div>
                        ) : (
                            <p>Aucune box pour aujourd'hui.</p>
                        )}
                    </ContainerBackgroundStyle>
                    <Title2Style>Autres jours</Title2Style>
                    <ContainerBackgroundStyle>
                        {/* Exemple de liste des jours précédents */}
                        {/* {party.previous_box?.map((box) => (
                            <PreviousDayItem key={box.id_box}>
                                {box.name} - {new Date(box.date!).toLocaleDateString()}
                            </PreviousDayItem>
                        ))} */}
                    </ContainerBackgroundStyle>
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoGameInfo;