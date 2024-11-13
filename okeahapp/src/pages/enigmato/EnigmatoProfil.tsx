import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, Title2Style, TextStyle } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, PreviewContainer, ContainerBackgroundStyle, EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { fetchParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile, updateProfile } from '../../services/enigmato/enigmatoProfileService';
import { IEnigmatoParticipants, IEnigmatoParty, IEnigmatoProfil } from '../../interfaces/IEnigmato';

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
                const updatedParticipants = await fetchParticipantsAsync(parseInt(id_party, 10), navigate);
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

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profil) {
            // Met à jour correctement le genre (true = femme, false = homme)
            setCurrentUserProfile({ ...profil, gender: e.target.value === 'female' });
        }
    };

    return (
        <>
            <HeaderTitleComponent title={`Profil de la partie : ${party?.name || ''}`} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    <ContainerBackgroundStyle>

                        <div style={{ marginBottom: '20px' }}>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={profil?.gender === true}
                                    onChange={handleGenderChange}
                                    disabled={!canEditProfile}
                                />
                                {t('female')}
                            </label>
                            <label style={{ marginLeft: '10px' }}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={profil?.gender === false}
                                    onChange={handleGenderChange}
                                    disabled={!canEditProfile}
                                />
                                {t('male')}
                            </label>
                        </div>


                        {/* Message si les photos sont manquantes */}
                        {(!profil?.picture1 || !isBase64(profil.picture1)) || (!profil?.picture2 || !isBase64(profil.picture2)) ? (
                            <TextStyle>{t('completeProfileMessage')}</TextStyle>
                        ) : null}

                        <PreviewContainer>
                            {/* Affichage des photos */}
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
                                    disabled={!canEditProfile}
                                />
                            </div>

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
                                    disabled={!canEditProfile}
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
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* Photo 2 du participant */}
                                    {participant.picture2 && isBase64(participant.picture2) ? (
                                        <img
                                            src={participant.picture2}
                                            alt={`${participant.name} ${participant.firstname} photo`}
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