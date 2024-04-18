import styled from "styled-components";
import MuiButton from "@mui/material/Button";
import { COLORS } from "../../styles/GlobalStyles";
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#F5C326',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#F5C326',
    },
  },
});

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 10px 10px 0 0;
  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
  position: sticky;
  top: 0;
  
`;

export const SmallChartContainer = styled.div`
  width: 40%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin: 5vh 0 0 10vw;

  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
`;

export const Button = styled(MuiButton)`
  &:hover {
    background-color: ${COLORS.special};
  }
  &:focus {
    color: ${COLORS.special};
  }
`;

export const Div = styled.div`
  height: 40vh;
  min-height: 338px;
`;
