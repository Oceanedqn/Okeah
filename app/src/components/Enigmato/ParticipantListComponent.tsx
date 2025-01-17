import React from 'react';
import { EnigmatoItemStyle } from '../../styles/EnigmatoStyles';
import { VscUnverified } from "react-icons/vsc";
import { GrValidate } from "react-icons/gr";
import { IEnigmatoParticipantsScores } from '../../interfaces/IEnigmato';
import { TextDarkStyle, Title2Style } from 'src/styles/GlobalStyles';

interface ParticipantsListProps {
    participants: IEnigmatoParticipantsScores[];
    isBase64: (str: string) => boolean;
    title: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, isBase64, title }) => {
    return (
        <>
            <Title2Style>{title}</Title2Style>
            <ul>
                {participants.map((participant) => (
                    <EnigmatoItemStyle key={participant.id_user}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {participant.picture2 && isBase64(participant.picture2) ? (
                                <img
                                    src={participant.picture2}
                                    alt={`${participant.name} ${participant.firstname}`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '10px',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '10px',
                                        backgroundColor: '#ccc',
                                    }}
                                />
                            )}

                            <TextDarkStyle>{participant.name} {participant.firstname}</TextDarkStyle>

                            {!participant.is_complete ? (
                                <span style={{ color: 'red', marginLeft: '10px' }}>
                                    <VscUnverified />
                                </span>
                            ) : (
                                <span style={{ color: 'green', marginLeft: '10px' }}>
                                    <GrValidate />
                                </span>
                            )}

                        </div>
                    </EnigmatoItemStyle>
                ))}
            </ul>
        </>
    );
};

export default ParticipantsList;