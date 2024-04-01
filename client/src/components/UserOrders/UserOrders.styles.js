import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';



const setLabelColor = (props) => {
    if (props.active) {
       return COLORS.special;
    } else if (props.id === 'trash') {
        return COLORS.red;
    } else {
       return COLORS.text; 
    }
};

export const IconTrash = styled(DeleteForeverTwoToneIcon)`
color: ${COLORS.red};

cursor: pointer;
`;
export const UserOrdersDiv = styled.div`
width: 100%;
background: ${COLORS.glassBkg};
border: ${COLORS.glassBorder};
box-shadow: none; /* Supprime toute ombre */
overflow: hidden; /* Assure que tout contenu débordant est masqué, utile pour les cas de scroll */
border-radius: 10px;

display: flex column;

justify-content: start;
align-items: center;
`;


export const OrderContainer = styled.div`
    width: 100%;
`;
export const HeaderDiv = styled.div`
  position: relative;
  width: 100%;
  height: 3em;
  background-color: ${COLORS.glassHeaderBkg};

  display: flex;
  justify-content: start;
  align-items: center;

  & .title {
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
    }

  & #open-orders {
    border-right: 0.01em solid white;
  }

  & #orders-history {
    border-left: 0.01em solid white;
  }
  

`;

export const AnimatedDiv = styled.div`
position: absolute;
top : 2.9em;
left: ${props => props.active ? 'calc(100% - 95.3em - 2em)' : '1.4em'};
width : 5em;
height : 0.01em;
Background: ${COLORS.special};
transition: left 0.5s ease-in-out;
`;

export const MyTable = styled(Table)`
`;
export const MyTableBody = styled(TableBody)`
& .MuiTableCell-body {
    padding: 1em;
}
`;
export const MyTableCell = styled(TableCell)`

& .buy{
    color: ${COLORS.green};
}
& .sell{
    color: ${COLORS.red};
}

`;
export const MyTableContainer = styled(TableContainer)`
`;
export const MyTableHead = styled(TableHead)`


& .MuiTableCell-root {
    background-color: rgba(255,255,255,0);
  }

  
`;
export const MyTablePagination = styled(TablePagination)`
& p, div, svg{
    color: ${COLORS.text};
}

`;
export const MyTableRow = styled(TableRow)`
height: 4em;
`;

export const Label = styled.label`
color: ${props => setLabelColor(props)};

cursor: ${props => props.id === "trash" ? "pointer": ""};

`;
