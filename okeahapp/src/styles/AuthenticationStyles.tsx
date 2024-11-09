import styled from "styled-components";


/* Styles pour l'élément centré */
export const CenteredElement = styled.div`
  width: 50vw; /* Ajuste la largeur selon tes besoins */
  padding: 16px;
  border-radius: 24px;
  border: none
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.background_alternatif};

  /* Centrage de l'élément */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;


export const LabelStyle = styled.label`
  display: block; /* Le label prend toute la largeur */
  width: 100%; /* S'assure que le label occupe toute la largeur */
  
  font-size: 16px; /* Taille de la police */
  padding-left:10px;
`

export const InputStyle = styled.input`
  border-radius: 24px; /* Coins arrondis de 24 pixels */
  border: none;
  padding: 16px;
  margin-bottom:16px;
  width: 100%;
  font-size: 16px;
  background-color: white!important;
`

