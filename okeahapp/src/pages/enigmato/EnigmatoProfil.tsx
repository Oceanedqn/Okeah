// pages/EnigmatoProfil.tsx
import React, { useState } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import styled from 'styled-components';
import { ButtonStyle } from '../../styles/GlobalStyles';
import { Container, Container2, EditButton, Header, ParticipantItem, ParticipantsContainer, ParticipantsTitle, PreviewContainer, ProfileContainer, Title } from '../../styles/EnigmatoStyles';

interface Participant {
    id: number;
    name: string;
}

// Données d'exemple pour les participants
const participantsData: Participant[] = [
    { id: 1, name: 'Participant 1' },
    { id: 2, name: 'Participant 2' },
    { id: 3, name: 'Participant 3' },
];

const EnigmatoProfil: React.FC<{  }> = ({  }) => {
    const { id_party } = useParams<{ id_party: string }>(); // Récupère le paramètre de l'URL

    const navigate = useNavigate();
    const [isProfileSet, setIsProfileSet] = useState(false);
    const [photo1, setPhoto1] = useState<File | null>(null);
    const [photo2, setPhoto2] = useState<File | null>(null);

    const handleBack = () => {
        navigate('/enigmato/parties');
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleSubmitProfile = () => {
        setIsProfileSet(true);
    };

    const handleEditProfile = () => {
        setIsProfileSet(false);
    };

    return (
        <Container2>
            <Header>
                <ButtonStyle onClick={handleBack}>Retour</ButtonStyle>
                <Title>test {id_party}</Title>
            </Header>

            <ProfileContainer>
                {!isProfileSet ? (
                    <>
                        <p>Merci de compléter le profil de jeu :</p>
                        <input type="file" onChange={(e) => handlePhotoChange(e, setPhoto1)} />
                        <input type="file" onChange={(e) => handlePhotoChange(e, setPhoto2)} />
                        
                        <PreviewContainer>
                            {photo1 && <img src={URL.createObjectURL(photo1)} alt="Photo 1 Preview" />}
                            {photo2 && <img src={URL.createObjectURL(photo2)} alt="Photo 2 Preview" />}
                        </PreviewContainer>

                        <ButtonStyle onClick={handleSubmitProfile}>Valider</ButtonStyle>
                    </>
                ) : (
                    <>
                        <PreviewContainer>
                            {photo1 && <img src={URL.createObjectURL(photo1)} alt="Photo 1" />}
                            {photo2 && <img src={URL.createObjectURL(photo2)} alt="Photo 2" />}
                        </PreviewContainer>
                        <EditButton onClick={handleEditProfile}>Modifier</EditButton>
                    </>
                )}
            </ProfileContainer>

            <ParticipantsContainer>
                <ParticipantsTitle>Liste des participants</ParticipantsTitle>
                <ul>
                    {participantsData.map((participant) => (
                        <ParticipantItem key={participant.id}>{participant.name}</ParticipantItem>
                    ))}
                </ul>
            </ParticipantsContainer>
        </Container2>
    );
};

export default EnigmatoProfil;