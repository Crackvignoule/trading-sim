import styled from "styled-components";
import MuiButton from "@mui/material/Button";
import { ChartContainer } from "../ChartContainer/ChartContainer";
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

export const SmallChartContainer = styled(ChartContainer)`
  display: block;
  width: 40%;
  border-radius: 10px 10px 0 0;
  margin: 5vh 0 0 10vw;
  padding: 0;
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
