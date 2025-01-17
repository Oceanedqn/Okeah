import React from 'react';
import { FaMedal } from "react-icons/fa";
import { IEnigmatoParticipantsScores } from '../../interfaces/IEnigmato';
import { TextStyle, Title2Style } from 'src/styles/GlobalStyles';
import { useTranslation } from 'react-i18next';

interface RankingComponentProps {
    participants: IEnigmatoParticipantsScores[];
    isBase64: (str: string) => boolean;
    title: string;
}

const RankingComponent: React.FC<RankingComponentProps> = ({ participants, isBase64, title }) => {

    const { t } = useTranslation();
    // Filtrer les participants pour ne garder que ceux qui sont complets et ont un score non nul
    const filteredParticipants = participants.filter(participant => participant.is_complete === true && participant.scores !== 0);

    // Assurez-vous que nous avons au moins 3 participants avant d'essayer d'afficher le podium
    const topParticipants = filteredParticipants.slice(0, 3);

    return (
        <>
            <Title2Style>{title}</Title2Style>
            <TextStyle>{t("explication_ranking")}</TextStyle>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', textAlign: 'center', marginTop: '20px' }}>
                {/* Left image (2nd place) */}
                <div style={{ textAlign: 'center', marginRight: '10px' }}>
                    {topParticipants[1]?.picture2 && isBase64(topParticipants[1]?.picture2) && (
                        <>
                            <img
                                src={topParticipants[1].picture2}
                                alt={`${topParticipants[1].name} ${topParticipants[1].firstname}`}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                }}
                            />
                            <TextStyle className='mt-2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {topParticipants[1].scores} <FaMedal style={{ marginLeft: '5px' }} />
                            </TextStyle>
                        </>
                    )}
                </div>

                {/* Middle image (1st place) */}
                <div style={{ textAlign: 'center', margin: '0 10px' }}>
                    {topParticipants[0]?.picture2 && isBase64(topParticipants[0]?.picture2) && (
                        <>
                            <img
                                src={topParticipants[0].picture2}
                                alt={`${topParticipants[0].name} ${topParticipants[0].firstname}`}
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '18px',
                                    objectFit: 'cover',
                                }}
                            />
                            <TextStyle className='mt-2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {topParticipants[0].scores} <FaMedal style={{ marginLeft: '5px' }} />
                            </TextStyle>
                        </>
                    )}
                </div>

                {/* Right image (3rd place) */}
                <div style={{ textAlign: 'center', marginLeft: '10px' }}>
                    {topParticipants[2]?.picture2 && isBase64(topParticipants[2]?.picture2) && (
                        <>
                            <img
                                src={topParticipants[2].picture2}
                                alt={`${topParticipants[2].name} ${topParticipants[2].firstname}`}
                                style={{
                                    width: '125px',
                                    height: '125px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                }}
                            />
                            <TextStyle className='mt-2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {topParticipants[2].scores} <FaMedal style={{ marginLeft: '5px' }} />
                            </TextStyle>
                        </>
                    )}
                </div>
            </div>

            {/* Section pour les autres participants */}
            <div style={{ display: 'flex', marginTop: '20px', gap: '5px' }}>
                {/* Afficher le reste des images des participants */}
                {filteredParticipants.slice(3).map((participant) => (
                    <div key={participant.id_user} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {participant.picture2 && isBase64(participant.picture2) && (
                            <>
                                <img
                                    src={participant.picture2}
                                    alt={`${participant.name} ${participant.firstname}`}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '10px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <TextStyle className='mt-2'>{participant.scores}</TextStyle>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default RankingComponent;
