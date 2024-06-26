import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";

// export const Header = styled.div`
//   align-items: center;
//   padding: 1vh 0 1vh 1vw;
//   border-radius: 10px 10px 0 0;
//   background-color: ${COLORS.glassBkg};
//   border: ${COLORS.glassBorder};
//   position: sticky;
//   top: 0;
// `;

// export const Container = styled.div`
//   justify-content: center;
//   width: 80%;
//   align-items: center;
//   border-radius: 10px;
//   box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
//   margin: 5vh 10vw 0 auto;

//   background-color: ${COLORS.glassBkg};
//   border: ${COLORS.glassBorder};
//   color: ${COLORS.text};
// `;

export const StyledTable = styled.table`
  width: 70%;
  margin: 5% auto;

  td, th {
    padding: 10px;
  }
`;

export const Td = styled.td`
    display: flex;
    align-items: center;
    
    &.positive {
        color: ${COLORS.green};
    }

    &.negative {
        color: ${COLORS.red};
    }
`;

export const Tr = styled.tr`
    display: flex;
    justify-content: space-between;
    
    background-color: ${COLORS.glassBkg};
    border: ${COLORS.glassBorder};
    color: ${COLORS.text};
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 0.2em;
    padding-left: 1em;
    padding-right: 1em;

    & > td:nth-child(1) {
        flex-basis: 7%;
        text-align: left;
    }

    & > td:nth-child(2) {
        flex-basis: 13%;
        text-align: left;
    }

    & > td:nth-child(3) {
        flex-basis: 12%;
        text-align: left;
    }

    & > td:nth-child(4) {
        flex-basis: 16%;
        text-align: left;
    }

    & > td:nth-child(5) {
        text-align: left;
    }
`;