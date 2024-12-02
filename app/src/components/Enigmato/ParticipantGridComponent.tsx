import React from 'react';
import { GridContainer, StyledCard } from '../../styles/EnigmatoStyles';
import { TextStyle, Title1Style } from '../../styles/GlobalStyles';
import { IEnigmatoParticipants } from '../../interfaces/IEnigmato';
import { useTranslation } from 'react-i18next';

interface ParticipantsGridComponentProps {
    participants: IEnigmatoParticipants[] | null;
    selectedParticipant: IEnigmatoParticipants | null;
    onParticipantClick: (participant: IEnigmatoParticipants) => void;
}



const ParticipantsGridComponent: React.FC<ParticipantsGridComponentProps> = ({ participants, selectedParticipant, onParticipantClick, }) => {

    const { t } = useTranslation();


    return (
        <div style={{ textAlign: "center" }}>
            <Title1Style style={{ marginTop: '20px' }}>{t("whois")}</Title1Style>
            {participants && participants.length > 0 && (
                <GridContainer>
                    {participants.map((participant) => (
                        <StyledCard
                            key={participant.id_user}
                            selected={selectedParticipant?.id_user === participant.id_user}
                            onClick={() => onParticipantClick(participant)}
                        >
                            <span>
                                {participant.firstname} {participant.name}
                            </span>
                            <img
                                src={participant.picture2}
                                alt={`${participant.firstname} ${participant.name}`}
                            />
                        </StyledCard>
                    ))}
                </GridContainer>
            )}
        </div>
    );
};

export default ParticipantsGridComponent;