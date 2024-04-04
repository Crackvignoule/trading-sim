import React, { useState, useEffect } from 'react';
import { AllOrdersDiv, OrderHeader, TitleLabel, SellDiv, MidDiv, BuyDiv, Row, Label, OrderMain, MidLabel } from './AllOrders.styles';
import { useTradedPair} from '../../context/Context';

function AllOrders() {
    const [TokenPrice, setTokenPrice] = useState(0);
    const { tradedPair } = useTradedPair(); // Récupéré de TradedPairContext


    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connexion WebSocket établie');
        };

        // Écouter les messages entrants
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            //setTokenPrice(message.data.price);
            console.log('Paire reçue:', message.pair);
        };

        // Nettoyer en fermant la connexion WebSocket quand le composant se démonte
        return () => {
            ws.close();
        };
    }, []);

return (
    <AllOrdersDiv>
        <OrderHeader>
            <TitleLabel>Price</TitleLabel>
            <TitleLabel>Amount</TitleLabel>
            <TitleLabel>Total</TitleLabel>
        </OrderHeader>
        <OrderMain>
            <SellDiv>
                <Row><Label className='sell'>64512.52</Label><Label className='sell'>0.25457848</Label><Label className='sell'>15987.12</Label></Row>
                <Row><Label className='sell'>64512.52</Label><Label className='sell'>0.25457848</Label><Label className='sell'>15987.12</Label></Row>
                <Row><Label className='sell'>64512.52</Label><Label className='sell'>0.25457848</Label><Label className='sell'>15987.12</Label></Row>
                <Row><Label className='sell'>64512.52</Label><Label className='sell'>0.25457848</Label><Label className='sell'>15987.12</Label></Row>
            </SellDiv>
            <MidDiv>
                <MidLabel>{TokenPrice}</MidLabel>
            </MidDiv>
            <BuyDiv>
                <Row><Label className='buy'>64512.52</Label><Label className='buy'>0.25457848</Label><Label className='buy'>15987.12</Label></Row>
                <Row><Label className='buy'>64512.52</Label><Label className='buy'>0.25457848</Label><Label className='buy'>15987.12</Label></Row>
                <Row><Label className='buy'>64512.52</Label><Label className='buy'>0.25457848</Label><Label className='buy'>15987.12</Label></Row>
                <Row><Label className='buy'>64512.52</Label><Label className='buy'>0.25457848</Label><Label className='buy'>15987.12</Label></Row>
            </BuyDiv>
        </OrderMain>
        
    </AllOrdersDiv>
);


}


export default AllOrders;