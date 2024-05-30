import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";

const setLabelColor = (props) => {
  if(props.activeValue !== false){
    if (props.activeValue > 0) {
      return COLORS.green;
   } else if (props.activeValue < 0) {
       return COLORS.red;
   } else if (props.activeValue === 0) {
      return 'rgba(177,177,177,0.8)';
   }else {
     return COLORS.text;
   }
  }
  
};

const setBkgColor = (props) => {
  if(props.activeValue !== false){
  if (props.activeValue > 0) {
     return COLORS.green + "20";
  } else if (props.activeValue < 0) {
      return COLORS.red + "20";
  } else if (props.activeValue === 0) {
     return 'rgba(177,177,177,0.2)';
  }else {
    return COLORS.glassBkg;
  }
}
};

export const Header = styled.div`
  align-items: center;
  padding: 1vh 0 1vh 1vw;
  border-radius: 10px 10px 0 0;
  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
  position: sticky;
  top: 0;
`;

export const Container = styled.div`
  justify-content: center;
  width: 80%;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin: 5vh 10vw 0 auto;

  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
  color: ${COLORS.text};
`;

export const Column = styled.td`
display: flex;
justify-content: center;
align-items: center;
width: 10em;
`;
export const ColumnLabel = styled.label`
color: ${props => setLabelColor(props)};
background-color: ${props => setBkgColor(props)};
background-opacity: 0.2;
border-radius: 0.5em;
padding: 0.3em;
`;

export const LogoColumn = styled.td`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0.8em;
    width: 10em;
`;
export const LogoColumnHeader = styled.th`
width: 10em;
padding-left: 0.8em;
`;
export const ColumnHeader = styled.th`
width: 10em;
`;

export const Row = styled.tr`
display: flex;
align-items: center;
justify-content: space-between;
`;
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  ${Row}:first-child {
    border-bottom: 2px solid ${COLORS.text};
  }

  ${Column}, ${ColumnHeader} {
    padding: 0.8em 0.2em 0.8em 0.2em;
  }
`;

export const Triangle = styled.span`
  margin-right: 5px;
  &.up {
    color: green;
  }
  &.down {
    color: red;
  }
`;