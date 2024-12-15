import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonStyle, ContainerUnderTitleStyle, TextStyle, } from '../../styles/GlobalStyles';
import { EnigmatoContainerStyle, PreviewContainer, TextStyleProfil } from '../../styles/EnigmatoStyles';
import HeaderTitleComponent from '../../components/base/HeaderTitleComponent';
import { useTranslation } from 'react-i18next';
import { fetchParticipantsAsync, getPartyAsync } from '../../services/enigmato/enigmatoPartiesService';
import { fetchProfile, updateProfile } from '../../services/enigmato/enigmatoProfileService';
import { IEnigmatoParticipants, IEnigmatoProfil } from '../../interfaces/IEnigmato';
import imageCompression from 'browser-image-compression';
import ParticipantsListComponent from 'src/components/Enigmato/ParticipantListComponent';
import PhotoUploadComponent from 'src/components/Enigmato/PhotoUploadComponent';
import LoadingComponent from 'src/components/base/LoadingComponent';

const EnigmatoProfil: React.FC = () => {
    const { id_party } = useParams<{ id_party: string }>();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<IEnigmatoParticipants[]>([]);
    const [profil, setCurrentUserProfile] = useState<IEnigmatoProfil | null>(null);
    const { t } = useTranslation();
    const [canEditProfile, setCanEditProfile] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null); // État pour les messages d'erreur des images



    useEffect(() => {
        const loadDatas = async () => {
            if (id_party) {
                try {
                    const currentUserProfile = await fetchProfile(parseInt(id_party, 10), navigate);
                    setCurrentUserProfile(currentUserProfile);

                    const participantsList = await fetchParticipantsAsync(parseInt(id_party, 10), navigate);
                    setParticipants(participantsList);

                    const party = await getPartyAsync(parseInt(id_party), navigate);
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

            const validMimeTypes = ['image/png', 'image/jpeg'];
            if (!validMimeTypes.includes(file.type)) {
                setImageError('Invalid file type. Please upload a PNG or JPG image.');
                return;
            }

            const maxSizeMB = 10; // Limite de 1 MB
            if (file.size > maxSizeMB * 1024 * 1024) {
                setImageError('File size exceeds the maximum limit of 10 MB.');
                return;
            }

            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };

            try {
                // Compress image
                const compressedFile = await imageCompression(file, options);

                // Vérification du contenu du fichier (exemple basique : header de l'image)
                const arrayBuffer = await compressedFile.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);

                // Vérifie si le fichier commence par des signatures spécifiques (magic numbers)
                const pngSignature = [0x89, 0x50, 0x4e, 0x47]; // PNG
                const jpgSignature = [0xff, 0xd8, 0xff]; // JPEG

                const isPng = uint8Array.slice(0, 4).every((byte, index) => byte === pngSignature[index]);
                const isJpg = uint8Array.slice(0, 3).every((byte, index) => byte === jpgSignature[index]);

                if (!isPng && !isJpg) {
                    setImageError('File content does not match PNG or JPG signature.');
                    return;
                }

                const base64String = await imageCompression.getDataUrlFromFile(compressedFile);

                // Update the profile with the compressed base64 image
                setCurrentUserProfile({ ...profil, [photoField]: base64String });
                setImageError(null); // Réinitialiser l'erreur en cas de succès
            } catch (error) {
                setImageError('Error compressing image. Please try again.');
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleSubmitProfile = async () => {
        if (profil && id_party) {
            setLoading(true);
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
                console.error('Erreur lors de la mise à jour du profil:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.error('Le profil ou l\'ID de la partie est manquant.');
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

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <HeaderTitleComponent title={"profile"} onBackClick={handleBack} />
            <ContainerUnderTitleStyle>
                <EnigmatoContainerStyle>
                    {/* Message si les photos sont manquantes */}
                    {((!profil?.picture1 || !isBase64(profil.picture1)) || (!profil?.picture2 || !isBase64(profil.picture2))) && (
                        <TextStyleProfil>
                            {t('completeProfileMessage')}
                        </TextStyleProfil>
                    )}

                    <PreviewContainer>
                        <PhotoUploadComponent
                            label={t('photoYoung')}
                            photoField="picture1"
                            photoUrl={profil?.picture1 || null}
                            isBase64={isBase64}
                            canEditProfile={canEditProfile}
                            handlePhotoChange={handlePhotoChange}
                            handleClickPhoto={handleClickPhoto}
                        />
                        <PhotoUploadComponent
                            label={t('photoNow')}
                            photoField="picture2"
                            photoUrl={profil?.picture2 || null}
                            isBase64={isBase64}
                            canEditProfile={canEditProfile}
                            handlePhotoChange={handlePhotoChange}
                            handleClickPhoto={handleClickPhoto}
                        />
                    </PreviewContainer>

                    {/* Afficher l'erreur d'image */}
                    {imageError && (
                        <TextStyle style={{ color: 'red', marginTop: '10px' }}>
                            {imageError}
                        </TextStyle>
                    )}
                    <ButtonStyle onClick={handleSubmitProfile} disabled={
                        !canEditProfile ||
                        !isBase64(profil?.picture1 || '') ||  // Vérifier si picture1 est valide
                        !isBase64(profil?.picture2 || '')      // Vérifier si picture2 est valide
                    }>
                        {t('edit')}
                    </ButtonStyle>
                    <ParticipantsListComponent
                        participants={participants}
                        isBase64={isBase64}
                        title={t('participantsList')}
                    />
                </EnigmatoContainerStyle>
            </ContainerUnderTitleStyle>
        </>
    );
};

export default EnigmatoProfil;
