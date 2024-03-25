import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";

export const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  margin: 20px;

  background-color: ${COLORS.glassBkg};
  border: ${COLORS.glassBorder};
  padding: 1em;
`;