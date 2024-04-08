import styled from "styled-components";
import { COLORS } from "../../styles/GlobalStyles";


const determineColor = (props) =>{
    if(props.active === "neutral"){
        return COLORS.text;
    }
    else if(props.active === "increasing"){
        return COLORS.green;
    }
    else if(props.active === "decreasing"){
        return COLORS.red;
    }
}
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
height: 14em;

padding-top: 1em;
padding-bottom: 1em;

display: flex;
flex-direction: column;
justify-content: end;
`;
export const MidDiv = styled.div`
width: 100%;
height: 2em;

border-top: ${COLORS.glassBorder};
border-bottom: ${COLORS.glassBorder};



display: flex;
align-items: center;

`;
export const BuyDiv = styled.div`
width: 100%;
height: 14em;

padding-top: 1em;
padding-bottom: 1em;

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

& .total{
    text-align: end;
}

& .price{
    text-align: start;
}

& .amount{
    text-align: center;
}
`;

export const TitleLabel = styled.label`
color: ${COLORS.text};
`;

export const Label = styled.label`
width: 7em;
`;


export const MidLabel = styled.label`
font-size: 18px;
margin-left: 1.5em;
color: ${props => determineColor(props)};
`;

