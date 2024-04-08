import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";

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

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr:first-child {
    border-bottom: 2px solid ${COLORS.text};
  }

  td, th {
    padding: 10px;
  }
`;

export const Td = styled.td`
    display: flex;
    align-items: center;
`;