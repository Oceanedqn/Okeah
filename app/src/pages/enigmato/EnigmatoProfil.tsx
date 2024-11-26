import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, Title2Style, TextStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, PreviewContainer, ContainerBackgroundStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { fetchParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile, updateProfile } from '../../services/enigmato/enigmatoProfileService';
import { IEnigmatoParticipants, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import imageCompression from 'browser-image-compression';

const EnigmatoProfil: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<IEnigmatoParticipants[]>([]);
    const [profil, setCurrentUserProfile] = useState<IEnigmatoProfil | null>(null);
    const [party, setParty] = useState<IEnigmatoParty | null>(null);
    const { t } = useTranslation();
    const [canEditProfile, setCanEditProfile] = useState<boolean>(false);

    useEffect(() => {
        const loadDatas = async () => {
            if (id_party) {
                try {
                    const currentUserProfile = await fetchProfile(parseInt(id_party, 10), navigate);
                    setCurrentUserProfile(currentUserProfile);

                    const participantsList = await fetchParticipantsAsync(parseInt(id_party, 10), navigate);
                    setParticipants(participantsList);

                    const party = await getPartyAsync(parseInt(id_party), navigate);
                    setParty(party);

                    const currentDate = new Date();
                    const startDate = new Date(party?.date_start || 0);

                    if (currentDate < startDate || (currentDate >= startDate && currentUserProfile?.is_complete === false)) {
                        setCanEditProfile(true);
                    } else {
                        setCanEditProfile(false);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données:", error);
                }
            }
        };

        loadDatas();
    }, [id_party, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>, photoField: 'picture1' | 'picture2') => {
        if (e.target.files && e.target.files[0] && profil) {
            const file = e.target.files[0];

            // Compression settings
            const options = {
                maxSizeMB: 1, // Adjust size to balance quality and file size
                maxWidthOrHeight: 1024, // Prevent excessive downscaling
                useWebWorker: true,
            };

            try {
                // Compress image
                const compressedFile = await imageCompression(file, options);
                const base64String = await imageCompression.getDataUrlFromFile(compressedFile);

                // Update the profile with the compressed base64 image
                setCurrentUserProfile({ ...profil, [photoField]: base64String });
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleSubmitProfile = async () => {
        if (profil && id_party) {
            try {
                await updateProfile(profil, navigate);
                const updatedParticipants = await fetchParticipantsAsync(parseInt(id_party, 10), navigate);
                setParticipants(updatedParticipants);

                const currentUserProfile = await fetchProfile(parseInt(id_party, 10), navigate);
                setCurrentUserProfile(currentUserProfile);

                if (currentUserProfile?.is_complete === true) {
                    navigate(`/enigmato/parties/${id_party}/game/info`);
                }
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
                        {/* Message si les photos sont manquantes */}
                        {(!profil?.picture1 || !isBase64(profil.picture1)) || (!profil?.picture2 || !isBase64(profil.picture2)) ? (
                            <TextStyle>{t('completeProfileMessage')}</TextStyle>
                        ) : null}

                        <PreviewContainer>
                            {/* Photo jeune */}
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <p style={{ marginBottom: '5px' }}>{t('photoYoung')}</p>
                                <div
                                    style={{ position: 'relative', width: '150px', height: '150px', backgroundColor: 'white', border: '1px solid #ccc' }}
                                    onClick={(e) => handleClickPhoto(e, 'picture1')}
                                >
                                    {profil?.picture1 && isBase64(profil.picture1) ? (
                                        <img
                                            src={profil.picture1}
                                            alt="1 Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : null}
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handlePhotoChange(e, 'picture1')}
                                        disabled={!canEditProfile}
                                    />
                                </div>
                            </div>

                            {/* Photo maintenant */}
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <p style={{ marginBottom: '5px' }}>{t('photoNow')}</p>
                                <div
                                    style={{ position: 'relative', width: '150px', height: '150px', backgroundColor: 'white', border: '1px solid #ccc' }}
                                    onClick={(e) => handleClickPhoto(e, 'picture2')}
                                >
                                    {profil?.picture2 && isBase64(profil.picture2) ? (
                                        <img
                                            src={profil.picture2}
                                            alt="2 Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : null}
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handlePhotoChange(e, 'picture2')}
                                        disabled={!canEditProfile}
                                    />
                                </div>
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {participant.picture2 && isBase64(participant.picture2) ? (
                                        <img
                                            src={participant.picture2}
                                            alt={`${participant.name} ${participant.firstname}`}
                                            style={{
                                                width: '40px',  // Taille de l'image
                                                height: '40px',
                                                borderRadius: 'Rpx',  // Pour arrondir l'image en cercle
                                                marginRight: '10px',  // Espacement entre l'image et le texte
                                                objectFit: 'cover',  // Pour que l'image garde une bonne forme
                                            }}
                                        />
                                    ) : (
                                        <div style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%', backgroundColor: '#ccc' }} /> // Placeholder si pas de photo
                                    )}

                                    <span>{participant.name} {participant.firstname}</span>

                                    {!participant.is_complete ? (
                                        <span style={{ color: 'red', marginLeft: '10px' }}>
                                            {t('profile_incomplete')}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'green', marginLeft: '10px' }}>
                                            {t('profile_complete')}
                                        </span>
                                    )}
                                </div>
                            </EnigmatoItemStyle>
                        ))}
                    </ul>
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoProfil;