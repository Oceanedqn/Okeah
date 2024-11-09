import styled from 'styled-components';


export const EnigmatoContainerStyle = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    max-width: 30vw;
    width: 100%;
    margin: 0 auto;
`;

export const EnigmatoSectionStyle = styled.div`

`;


export const EnigmatoItemStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.background_light};
    border-radius: 10px;
`;


export const ContainerBackgroundStyle = styled.div`
    background-color: ${({ theme }) => theme.colors.background_light};
    padding: 20px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;




// ######### ENIGMATO HOME #########



export const OngoingGamesContainer = styled.div`
    margin-top: 20px;
    text-align: left;
`;

export const OngoingTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;
`;

export const OngoingGameItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;





export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    width: 90%;
    text-align: center;
`;



// PROFILES

export const Container2 = styled.div`
    padding: 80px 20px 20px;
    text-align: center;
    position: relative;
`;

export const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
`;

export const Title2 = styled.h1`
    font-size: 2rem;
    color: #333;
`;



export const PreviewContainer = styled.div`
    display: flex;
    gap: 10px;
    margin: 15px 0;

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #ccc;
    }
`;

export const EditButton = styled.button`
    background: none;
    color: blue;
    border: none;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
`;

export const ParticipantsContainer = styled.div`
    background: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
`;

export const ParticipantsTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

export const ParticipantItem = styled.li`
    list-style: none;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
`;


// INFO GAMES
export const DateContainer = styled.div`
    margin: 20px 0;
    font-size: 16px;
`;

export const PreviousDaysContainer = styled.div`
    margin-top: 20px;
    text-align: left;
`;

export const PreviousDayItem = styled.div`
    margin: 5px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const AutoCompleteContainer = styled.div`
    position: relative;
    margin: 10px 0;

    input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    ul {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        z-index: 1;
        max-height: 150px;
        overflow-y: auto;
    }

    li {
        padding: 8px;
        cursor: pointer;

        &:hover {
            background: #f0f0f0;
        }
    }
`;