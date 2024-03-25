import styled from "styled-components";
import MuiButton from "@mui/material/Button";
import { COLORS } from "../../styles/GlobalStyles";

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

export const ChartContainer = styled.div`
  display: flex column;
  width: 40%;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin: 20px;

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
`;
