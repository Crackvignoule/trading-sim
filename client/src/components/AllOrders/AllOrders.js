import React, { useState, useEffect } from 'react';
import { AllOrdersDiv, OrderHeader, TitleLabel, SellDiv, MidDiv, BuyDiv, Row, Label, OrderMain, MidLabel } from './AllOrders.styles';
import { useTradedPair} from '../../context/Context';

function AllOrders() {
    const [tokenPrice, setTokenPrice] = useState(0);
    const { tradedPair, setTradedPair } = useTradedPair(); // Récupéré de TradedPairContext
    const [activeTokenAction, setActiveTokenAction] = useState("neutral");
    const [sellOrdersRows, setSellOrdersRows] = useState([]);
    const [buyOrdersRows, setBuyOrdersRows] = useState([]);


    const addSellOrdersRows = (newSellOrder) => {
        setSellOrdersRows(currentRows => {
            const updatedRows = [...currentRows, newSellOrder];
            // Garder la taille du tableau à 8 éléments
            if (updatedRows.length > 8) {
                updatedRows.shift(); // Supprime le premier élément du tableau
            }
            return updatedRows;
        });
    };

    const addBuyOrdersRows = (newBuyOrder) => {
        setBuyOrdersRows(currentRows => {
            const updatedRows = [newBuyOrder, ...currentRows];
            // Garder la taille du tableau à 8 éléments
            if (updatedRows.length > 8) {
                updatedRows.pop(); // Supprime le dernier élément du tableau
            }
            return updatedRows;
        });
    };
    
    
    

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connexion WebSocket établie');
        };

        // Écouter les messages entrants
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (tradedPair === message.pair) {
                const newTokenPrice = parseFloat(message.data.value);
        
                // Utilisation de la mise à jour conditionnelle
                setTokenPrice((prevTokenPrice) => {
                    if (newTokenPrice < prevTokenPrice) {
                        setActiveTokenAction("decreasing");
                    } else if (newTokenPrice > prevTokenPrice) {
                        setActiveTokenAction("increasing");
                    }
                    return newTokenPrice; // Mettre à jour le prix du token après la comparaison
                });
            }
        };


        const ws2 = new WebSocket('ws://localhost:8585');

        ws2.onopen = () => {
            console.log('Connexion WebSocket2 établie');
        };

        // Écouter les messages entrants
        ws2.onmessage = (event) => {
            const order = JSON.parse(event.data);
            if(tradedPair === order.tradedPair){
                if(order.direction === "buy"){
                    addBuyOrdersRows(order);
                }else if(order.direction === "sell"){
                    addSellOrdersRows(order);
                }
            }
            console.log(buyOrdersRows);
        };
        // Nettoyer en fermant la connexion WebSocket quand le composant se démonte
        return () => {
            ws.close();
            ws2.close();
        };

    }, []);



    useEffect(() => {
        const getAllBuyOrders = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/get-all-buy-orders', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }
                });
                const results = await response.json();
                if (response.status === 200) {
                    const oldBuyOrders = results.data.data.reverse();
                    setBuyOrdersRows(oldBuyOrders);
                } else{
                    console.log("Échec récupération des ordres");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-all-buy-orders', error);
            }
        };
        getAllBuyOrders();


        const getAllSellOrders = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/get-all-sell-orders', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }
                });
                const results = await response.json();
                if (response.status === 200) {
                    const oldSellOrders = results.data.data.reverse();
                    setSellOrdersRows(oldSellOrders);
                } else{
                    console.log("Échec récupération des ordres");
                }
            } catch (error) {
                    console.error('Erreur lors de la requête /get-all-sell-orders', error);
            }
        };
        getAllSellOrders();


    }, []);


    useEffect(() => {
        setSellOrdersRows([]);
        setBuyOrdersRows([]);
    }, [tradedPair]);

return (
    <AllOrdersDiv>
        <OrderHeader>
            <TitleLabel>Price</TitleLabel>
            <TitleLabel>Amount</TitleLabel>
            <TitleLabel>Total</TitleLabel>
        </OrderHeader>
        <OrderMain>
            <SellDiv>
                {sellOrdersRows.map((order, index) => (
                    <Row key={index}>
                        <Label className='sell price'>{order.price}</Label>
                        <Label className='sell amount'>{order.amount}</Label>
                        <Label className='sell total'>{order.total}</Label>
                    </Row>
                ))}
            </SellDiv>
            <MidDiv>
                <MidLabel active={activeTokenAction}>{tokenPrice}</MidLabel>
            </MidDiv>
            <BuyDiv>
                {buyOrdersRows.map((order, index) => (
                    <Row key={index}>
                        <Label className='buy price'>{order.price}</Label>
                        <Label className='buy amount'>{order.amount}</Label>
                        <Label className='buy total'>{order.total}</Label>
                    </Row>
                ))}
            </BuyDiv>
        </OrderMain>
        
    </AllOrdersDiv>
);


}


export default AllOrders;