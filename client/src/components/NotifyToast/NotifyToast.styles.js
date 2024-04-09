import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";
import { Alert, LinearProgress } from '@mui/material';


export const MyAlert = styled(Alert)`
position: relative;
`;

export const MyLinearProgress = styled(LinearProgress)`
  position: absolute;
  bottom: 0.28em;
  left: 0;
  width: 100%;
  border-radius: 0 0 0 5px;
`;

export const Button = styled.button`
position: absolute;
top: 5em;
left: 5em;
width: 5em;
height: 5em;
`;