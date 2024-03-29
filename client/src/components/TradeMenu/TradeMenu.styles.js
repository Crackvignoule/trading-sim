import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';



export const TradeMenuDiv = styled.div`
background: ${COLORS.glassBkg};
width: 23em;
height : 33em;
border-radius: 10px;
border: ${COLORS.glassBorder};

display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`;

export const Header = styled.div`
position: relative;
width: 100%;
background: ${COLORS.glassHeaderBkg};
border-radius: 10px 10px 0px 0px;
height: 4em;

display: flex;
justify-content: center;
align-items: center;

`;

export const ButtonDiv = styled.div`
`;



export const MidDiv = styled.div`
width: 80%;

`;

export const HeaderMidDiv = styled.div`
display: flex;
justify-content: space-between;
align-items:center;
width: 100%;
margin-bottom: 0.2em;
`;

export const InputDiv1 = styled.div`
`;
export const InputDiv2 = styled.div`
`;

export const GaugeBarDiv = styled.div`
`;

export const SliderBar = styled(Slider)`
& .MuiSlider-track {
    color: ${COLORS.text}; /* Change la couleur de la barre remplie */
  }

  & .MuiSlider-thumb {
    color: ${COLORS.special}; /* Change la couleur de la boule */
  }

  & .MuiSlider-markLabel {
    color: ${COLORS.text}; /* Change la couleur du texte sous la barre */
  }

  & .MuiSlider-rail {
    color: ${COLORS.text}; /* Change la couleur de la sous barre */
  }

  & .MuiSlider-mark {
    background-color: ${COLORS.special}; /* Change la couleur de des marqueurs de pas */
  }
  margin-bottom:1em;
`;

export const InputBox = styled.div`
margin : 0em 0em 1em 0em;

&#input-total {
    margin : 0em 0em 0.1em 0em;
}
`;

export const GaugeBarLabelDiv = styled.div`
display: flex;
justify-content: space-between;
`;

export const SliderDiv = styled.div`
margin-bottom:1em;
`;

export const AnimatedDiv = styled.div`
position: absolute;
top : 3.93em;
left: ${props => props.active ? 'calc(100% - 2em - 6.6em)' : '2.8em'};
background : ${COLORS.special};
width:6em;
height:0.1em;
transition: left 0.5s ease-in-out;
`;

export const TitleLabel = styled.label`
color: ${props => props.active ? COLORS.special : COLORS.text};
width : 5em;
text-align:center;
font-size : 1.4em;
width: 49%;

&#left-label{ border-right: 0.01em solid white; }
&#right-label{ border-left: 0.01em solid white; }

&:hover {
    cursor: pointer;
}

`;

export const SubTitleLabel = styled.label`
font-size: 1.1em;
color: ${COLORS.text};

&#label-limit {
    color: ${props => props.active ? COLORS.special : COLORS.text};
}

&#label-market {
    color: ${props => props.active ? COLORS.special : COLORS.text};
}
`;

export const Label = styled.label`
font-size: 0.9em;
color: ${COLORS.text};

&#label-max{
    color: ${COLORS.special};
    cursor: Pointer;
}

&#label-available{
    width:13em;
}
`;

export const InputText = styled(({ readOnly, disabledMode, inputProps, ...props }) => <TextField {...props} InputProps={{ ...inputProps, readOnly, endAdornment: inputProps?.endAdornment }} />)`

& .MuiOutlinedInput-root {
    fieldset {
      border-color: ${COLORS.text}; // Couleur par défaut de la bordure
      background: ${props => props.disabledMode ? COLORS.glassBkg : "rgba(0,0,0,0)"};
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
    color: white;
    
  }
  width: 100%;


`;

export const Button = styled.button`
width: 5em;
height : 3em;
border-radius: 10px;
color: ${COLORS.text};
font-size:1.1em;
border: 0;
cursor: pointer;

margin-bottom:1em;
&#btn-buy{
    display: ${props => props.active ? "block" : "none"};
    background: ${COLORS.green};
}
&#btn-sell{
    display: ${props => props.active ? "block" : "none"};
    background: ${COLORS.red};
}
`;

