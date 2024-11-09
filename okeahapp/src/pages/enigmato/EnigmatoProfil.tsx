import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, Title2Style, TextStyle } from '../../styles/GlobalStyles';
import { Container2, EditButton, EnigmatoContainerStyle, EnigmatoItemStyle, Header, ParticipantItem, ParticipantsContainer, ParticipantsTitle, PreviewContainer, ContainerBackgroundStyle } from '../../styles/EnigmatoStyles';
import { User } from '../../interfaces/IUser';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { fetchParticipants } from '../../services/enigmato/enigmatoPartiesService';

const EnigmatoProfil: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<User[]>([]);
    const [isProfileSet, setIsProfileSet] = useState(false);
    const [photo1, setPhoto1] = useState<File | null>(null);
    const [photo2, setPhoto2] = useState<File | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const loadParticipants = async () => {
            if (id_party) {
                try {
                    const participantsData = await fetchParticipants(parseInt(id_party, 10), navigate);
                    setParticipants(participantsData);
                } catch (error) {
                    console.error("Erreur lors de la récupération des participants:", error);
                }
            }
        };

        loadParticipants();
    }, [id_party]);

    const handleBack = () => {
        navigate(`/enigmato/parties/${id_party}/game/info`);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleDeletePhoto = (setPhoto: React.Dispatch<React.SetStateAction<File | null>>) => {
        setPhoto(null); // Supprimer la photo en la définissant sur null
    };

    const handleSubmitProfile = () => {
        setIsProfileSet(!isProfileSet); // Basculer entre Valider et Modifier
    };

    return (
        <>
            <HeaderTitleComponent title="Partie :" onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ContainerBackgroundStyle>

                        {/* Affiche un message si photo1 ou photo2 est manquante */}
                        {(!photo1 || !photo2) && <TextStyle>Merci de compléter le profil de jeu</TextStyle>}

                        <PreviewContainer>
                            {/* Affiche photo1 ou un carré blanc si photo1 est manquante */}
                            <div style={{ position: 'relative' }}>
                                {photo1 ? (
                                    <>
                                        <img src={URL.createObjectURL(photo1)} alt="Photo 1 Preview" />
                                        <ButtonStyle onClick={() => handleDeletePhoto(setPhoto1)} style={{ position: 'absolute', top: 0, right: 0 }}>X</ButtonStyle>
                                    </>
                                ) : (
                                    <div style={{ width: '100px', height: '100px', backgroundColor: 'white', border: '1px solid #ccc' }} />
                                )}
                            </div>
                            {/* Affiche photo2 ou un carré blanc si photo2 est manquante */}
                            <div style={{ position: 'relative' }}>
                                {photo2 ? (
                                    <>
                                        <img src={URL.createObjectURL(photo2)} alt="Photo 2 Preview" />
                                        <ButtonStyle onClick={() => handleDeletePhoto(setPhoto2)} style={{ position: 'absolute', top: 0, right: 0 }}>X</ButtonStyle>
                                    </>
                                ) : (
                                    <div style={{ width: '100px', height: '100px', backgroundColor: 'white', border: '1px solid #ccc' }} />
                                )}
                            </div>
                        </PreviewContainer>

                        {!isProfileSet && (
                            <>
                                <input type="file" onChange={(e) => handlePhotoChange(e, setPhoto1)} />
                                <input type="file" onChange={(e) => handlePhotoChange(e, setPhoto2)} />
                            </>
                        )}

                        {/* Bouton Valider ou Modifier en fonction de isProfileSet */}
                        <ButtonStyle onClick={handleSubmitProfile}>
                            {isProfileSet ? "Modifier" : "Valider"}
                        </ButtonStyle>
                    </ContainerBackgroundStyle>

                    <Title2Style>{t('participants_list')}</Title2Style>
                    <ul>
                        {participants.map((participant) => (
                            <EnigmatoItemStyle key={participant.id_user}>
                                {participant.name} {participant.firstname}
                            </EnigmatoItemStyle>
                        ))}
                    </ul>
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoProfil;