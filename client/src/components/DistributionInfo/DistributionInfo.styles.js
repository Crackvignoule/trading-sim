import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";

export const Header = styled.div`
  align-items: center;
  padding: 1vh 0 1vh 1vw;
  margin: 0 0 2vh 0;
  border-radius: 10px 10px 0 0;
  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
  position: sticky;
  top: 0;
`;

export const PieChartContainer = styled.div`
  justify-content: center;
  width: 40%;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin: 5vh 10vw 0 1vw;

  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
`;
