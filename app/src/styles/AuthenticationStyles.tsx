import styled from "styled-components";


/* Styles pour l'élément centré */
export const CenteredElement = styled.div`
  padding: 16px;
  border-radius: 24px;
  max-width: 600px!important;
  border: none;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.background_alternatif};
`;


export const LabelStyle = styled.label`
  display: block; /* Le label prend toute la largeur */
  width: 100%; /* S'assure que le label occupe toute la largeur */
  font-size: 16px;
  padding-left:10px;
`;

export const InputStyle = styled.input`
  border-radius: 24px; /* Coins arrondis de 24 pixels */
  border: none;
  padding: 10px;
  margin-bottom:16px;
  width: 100%;
  font-size: 16px;
  background-color: white!important;
`;

export const RadioInputStyle = styled.input`
  display: none; /* Hide the default radio button */

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary}; /* Primary color when checked */
    border: none; /* Border color when checked */
  }

  &:focus {
    outline: none; /* Remove default outline on focus */
  }
`;

export const CustomRadioStyle = styled.span`
  display: inline-block;
  width: 20px; /* Outer circle width */
  height: 20px; /* Outer circle height */
  border-radius: 50%; /* Make it circular */
  background-color: white !important; /* White background */
  margin-right: 10px; /* Space between the radio and label */
  position: relative; /* Position relative for the inner circle */
  
  /* Inner circle when checked */
  ${RadioInputStyle}:checked + &::after {
    content: ""; /* Needed for the pseudo-element */
    position: absolute; /* Position it within the parent */
    top: 50%; /* Center it vertically */
    left: 50%; /* Center it horizontally */
    width: 10px; /* Inner circle width */
    height: 10px; /* Inner circle height */
    border-radius: 50%; /* Make it circular */
    background-color: ${({ theme }) => theme.colors.primary}; /* Primary color when selected */
    transform: translate(-50%, -50%); /* Center the inner circle */
  }
`;

export const RadioLabelStyle = styled.label`
  display: flex; /* Align items horizontally */
  align-items: center; /* Center vertically */
  cursor: pointer; /* Change cursor on hover */
  margin-bottom: 8px; /* Spacing between radio options */
  
  /* Optional: Remove outline from radio input on focus */
  ${RadioInputStyle} {
    outline: none; /* Remove default outline */
  }
`;


export const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  height: 100vh; /* Full height of the viewport */
  padding: 20px;
  gap: 20px; /* Space between components */
`;

