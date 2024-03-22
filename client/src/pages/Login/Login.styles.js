import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";
import TextField from '@mui/material/TextField';

const determineTop = (props) => {
  if (props.active & props.activeError) {
    return "1.3em";
  } else if (props.active & !props.activeError) {
    return "1.7em";
  } else if (!props.active & props.activeError) {
    return "2.2em";
  } else if (!props.active & !props.activeError){
    return "2.4em";
  }
};

export const AnimatedDiv = styled.div`
  position: absolute;
  top: ${props => determineTop(props)};
  left: ${props => props.active ? 'calc(100% - 2em - 6.2em)' : '3.6em'};
  background: ${COLORS.special};
  width: 4.5em;
  height: 2em;
  border-radius: 5px;
  z-index: 101;
  transition: left 0.5s ease-in-out;
`;

export const Label = styled.label`
  color: ${props => props.active ? COLORS.text : COLORS.special};
  margin-left: 1.5em;
  margin-right: 1.5em;
  margin-top: 1em;
  margin-bottom: 1em;
  z-index: 102;
  cursor: pointer; // Rend les labels cliquables visuellement
`;

export const InputText = styled(TextField)`
& .MuiOutlinedInput-root {
    fieldset {
      border-color: ${COLORS.text}; // Couleur par défaut de la bordure
    }
    &:hover fieldset {
      border-color: ${COLORS.special}; // Couleur de la bordure au survol
    }
    &.Mui-focused fieldset {
      border-color: ${COLORS.special}; // Couleur de la bordure lors de la sélection
    }
  }

  & .MuiInputLabel-root {
    color: rgba(255,255,255,0.5); // Couleur de l'étiquette en état normal
  }
  
  & .MuiInputLabel-root.Mui-focused {
    color: ${COLORS.special}; // Couleur de l'étiquette lors de la sélection
  }

  & .MuiInputBase-input {
    color: white; // Change la couleur du texte saisi
  }
  
`;
export const BkgDiv = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.65);
    z-index: 99;
    display:flex;
    justify-content:center;
    align-items:center;
`;

export const FormDiv = styled.div`
    position: relative;
    z-index: 100;
    background: ${COLORS.background};
    opacity: 0.8;
    border-radius: 10px;
    border: ${COLORS.glassBorder};
    width: 18em;
    height: 23em;

    display:flex;
    flex-direction:column;
    justify-content:space-around;
    align-items:center;

`;

export const HeaderDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${COLORS.glassBkg};
    border-radius: 10px;
    margin-top:1em;
`;

export const SwitchDiv = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;

`;
export const InputDiv = styled.div`

&.sign-up-mode {
    display : ${props => props.active ? "block" : "none"};
}
margin-top:1em;
margin-bottom:1em;`;

export const ButtonDiv = styled.div`
margin-bottom: 1em;
`;

export const MidDiv = styled.div``;

export const Errordiv = styled.div`
display : ${props => props.active ? "block" : "none"};
color : ${COLORS.red};
font-size:12px;
margin-top:0.3em;
height:1.2em;
`;

export const Button = styled.button`;
&.sign-up-mode {
    display: ${props => props.active ? "block" : "none"};
}

&.sign-in-mode {
    display: ${props => props.active ? "block" : "none"};
}

background-color: ${COLORS.special};
border: 0;
border-radius: 10px;
width : 6em;
height : 2.5em;
color:${COLORS.text};
font-size: 18px;


`;
