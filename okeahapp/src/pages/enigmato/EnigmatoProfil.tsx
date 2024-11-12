import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, Title2Style, TextStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, PreviewContainer, ContainerBackgroundStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { fetchParticipants, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile, updateProfile } from '../../services/enigmato/enigmatoProfileService';
import { IEnigmatoParticipants, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';

const EnigmatoProfil: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<IEnigmatoParticipants[]>([]);
    const [profil, setCurrentUserProfile] = useState<IEnigmatoProfil | null>(null);
    const [party, setParty] = useState<IEnigmatoParty | null>(null);
    const { t } = useTranslation();
    const [canEditProfile, setCanEditProfile] = useState<boolean>(false); // État pour vérifier si l'utilisateur peut modifier son profil

    useEffect(() => {
        const loadDatas = async () => {
            if (id_party) {
                try {
                    const currentUserProfile = await fetchProfile(parseInt(id_party, 10), navigate);
                    setCurrentUserProfile(currentUserProfile);

                    const participants = await fetchParticipants(parseInt(id_party, 10), navigate);
                    setParticipants(participants);

                    const party = await getPartyAsync(parseInt(id_party), navigate);
                    setParty(party);

                    // Vérification si la partie n'a pas encore commencé
                    const currentDate = new Date();
                    const startDate = new Date(party?.date_start || 0);

                    // L'utilisateur peut modifier son profil uniquement si :
                    // 1. La partie n'a pas encore commencé.
                    if (currentDate < startDate) {
                        setCanEditProfile(true);
                    } else {
                        setCanEditProfile(false); // Impossible de modifier si la partie a commencé
                    }

                } catch (error) {
                    console.error("Erreur lors de la récupération des données:", error);
                }
            }
        };

        loadDatas();
    }, [id_party]);

    const handleBack = () => {
        navigate(-1);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, photoField: 'picture1' | 'picture2') => {
        if (e.target.files && e.target.files[0] && profil) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCurrentUserProfile({ ...profil, [photoField]: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitProfile = async () => {
        if (profil && id_party) {
            try {
                await updateProfile(profil, navigate);

                // Re-fetch participants to update the profile status
                const updatedParticipants = await fetchParticipants(parseInt(id_party, 10), navigate);
                setParticipants(updatedParticipants);

                const currentUserProfile = await fetchProfile(parseInt(id_party, 10), navigate);
                setCurrentUserProfile(currentUserProfile);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du profil:", error);
            }
        } else {
            console.error("Le profil ou l'ID de la partie est manquant.");
        }
    };

    const handleClickPhoto = (e: React.MouseEvent<HTMLDivElement>, photoField: 'picture1' | 'picture2') => {
        const input = e.currentTarget.querySelector('input');
        if (input) input.click();
    };

    const isBase64 = (str: string) => {
        const regex = /^data:image\/[a-z]+;base64,/;
        return regex.test(str);
    };

    return (
        <>
            <HeaderTitleComponent title={`Profil de la partie : ${party?.name || ''}`} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ContainerBackgroundStyle>
                        {/* Show message if picture1 or picture2 is missing */}
                        {(!profil?.picture1 || !isBase64(profil.picture1)) || (!profil?.picture2 || !isBase64(profil.picture2)) ? (
                            <TextStyle>{t('completeProfileMessage')}</TextStyle>
                        ) : null}

                        <PreviewContainer>
                            {/* Display photo1 or a white square if photo1 is missing */}
                            <div
                                style={{ position: 'relative', width: '100px', height: '100px', backgroundColor: 'white', border: '1px solid #ccc' }}
                                onClick={(e) => handleClickPhoto(e, 'picture1')}
                            >
                                {profil?.picture1 && isBase64(profil.picture1) ? (
                                    <img
                                        src={profil.picture1}
                                        alt="Photo 1 Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : null}
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePhotoChange(e, 'picture1')}
                                    disabled={!canEditProfile} // Désactive le champ si la partie a commencé
                                />
                            </div>

                            {/* Display photo2 or a white square if photo2 is missing */}
                            <div
                                style={{ position: 'relative', width: '100px', height: '100px', backgroundColor: 'white', border: '1px solid #ccc' }}
                                onClick={(e) => handleClickPhoto(e, 'picture2')}
                            >
                                {profil?.picture2 && isBase64(profil.picture2) ? (
                                    <img
                                        src={profil.picture2}
                                        alt="Photo 2 Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : null}
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePhotoChange(e, 'picture2')}
                                    disabled={!canEditProfile} // Désactive le champ si la partie a commencé
                                />
                            </div>
                        </PreviewContainer>

                        <ButtonStyle onClick={handleSubmitProfile} disabled={!canEditProfile}>
                            {t('edit')}
                        </ButtonStyle>
                    </ContainerBackgroundStyle>

                    {profil && (
                        <div>
                            <h3>{t('yourProfile')}</h3>
                            <p>{profil.id_profil}</p>
                        </div>
                    )}

                    <Title2Style>{t('participantsList')}</Title2Style>
                    <ul>
                        {participants.map((participant) => (
                            <EnigmatoItemStyle key={participant.id_user}>
                                {participant.name} {participant.firstname}
                                {!participant.is_complete ? (
                                    <span style={{ color: 'red', marginLeft: '10px' }} >
                                        {t('profile_incomplete')}
                                    </span>
                                ) : (
                                    <span style={{ color: 'green', marginLeft: '10px' }}>
                                        {t('profile_complete')}
                                    </span>
                                )}
                            </EnigmatoItemStyle>
                        ))}
                    </ul>
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoProfil;