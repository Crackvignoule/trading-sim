import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";


export const AllOrdersDiv = styled.div`
width: 23em;
height : 33em;

border: ${COLORS.glassBorder};
border-radius: 10px;
background: ${COLORS.glassBkg};

display: flex;
flex-direction: column;
justify-content: start;
align-items: space-around;

`;

export const OrderHeader = styled.div`
width: 100%;
height: 3em;
background: ${COLORS.glassHeaderBkg};
border-radius: 10px 10px 0 0;

display: flex;
justify-content: space-around;
align-items: center;
`;


export const OrderMain = styled.div`
width: 100%;

height: 30em;
display: flex;
flex-direction: column;
justify-content: center;
`;

export const SellDiv = styled.div`
width: 100%;

display: flex;
flex-direction: column;
justify-content: end;
`;
export const MidDiv = styled.div`
width: 100%;
height: 2em;

border-top: ${COLORS.glassBorder};
border-bottom: ${COLORS.glassBorder};

margin-top: 0.5em;
margin-bottom: 0.5em;

display: flex;
align-items: center;

`;
export const BuyDiv = styled.div`
width: 100%;

display: flex;
flex-direction: column;
justify-content: start;
`;
export const Row = styled.div`
height: 1.5em;
widht: 100%;
display: flex;
padding-left: 1.5em;
padding-right: 1.5em;
justify-content: space-between;
align-items: center;

& .sell{
    color: ${COLORS.red};
}

& .buy{
    color: ${COLORS.green};
}
`;

export const TitleLabel = styled.label`
color: ${COLORS.text};
`;

export const Label = styled.label`
`;


export const MidLabel = styled.label`

margin-left: 1.5em;
`;

