import React from "react";
import { Header, Container, StyledTable, LogoColumn, Column, ColumnHeader, Row, LogoColumnHeader,ColumnLabel, ColumnDiv } from "./OwnedCryptos.styles";
import { useState, useEffect } from "react";

function OwnedCryptos() {

  const [cryptos, setCryptos] = useState([]);

  const getAllCryptoOwned = async () => {
    try{
        let userToken = localStorage.getItem('token');
        const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/get-all-crypto-owned`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userToken: userToken
            }),
        });
        const results = await response.json();
        if (response.status === 200) {
            const cryptoData = results.data;
            setCryptos(cryptoData);
        } else{
            console.log("Échec récupération des cryptos possédées");
        }
    } catch (error) {
            console.error('Erreur lors de la requête /get-all-crypto-owned', error);
    }
};

useEffect(() => {
    getAllCryptoOwned();
}
, []);

  const getSymbolVariation = (value) => { 
    if (value === "") {
      return "/";
    } else if (value > 0) {
        return "▲ ";
    } else if (value < 0) {
        return "▼ ";
    } else {
        return "─ ";
    }
  }

  const getTextVariation = (value) => { 
    if (value === "") {
      return "";
    } else{
      return value + " %";
    }
  }

  return (
    <Container>
        <Header>
            Owned Cryptos
        </Header>
        <StyledTable>
            <Row>
                <LogoColumnHeader>Crypto</LogoColumnHeader>
                <ColumnHeader>Amount</ColumnHeader>
                <ColumnHeader>Value</ColumnHeader>
                <ColumnHeader>24h</ColumnHeader>
                <ColumnHeader>7d</ColumnHeader>
                <ColumnHeader>1m</ColumnHeader>
                <ColumnHeader>1y</ColumnHeader>
            </Row>
            {cryptos.map((crypto) => (
              <Row key={crypto.symbol}>
                <LogoColumn>
                  <img src={crypto.logo} alt={crypto.symbol} style={{width: '30px', marginRight: '10px'}} />
                  {crypto.symbol} ({crypto.nameToken})
                </LogoColumn>
                <Column><ColumnLabel activeValue={false}>{crypto.amount}</ColumnLabel></Column>
                <Column><ColumnLabel  activeValue={false}>{crypto.value === "" ? "" : crypto.value + " USDT"}</ColumnLabel></Column>
                <Column>
                  <ColumnDiv activeValueBkg={crypto.variation24H}>
                    <ColumnLabel className="symbolLabel" activeValue={crypto.variation24H}>{getSymbolVariation(crypto.variation24H)}</ColumnLabel>
                    <ColumnLabel activeValue={crypto.variation24H}>{getTextVariation(crypto.variation24H)}</ColumnLabel>
                  </ColumnDiv>
                </Column>
                <Column>
                  <ColumnDiv activeValueBkg={crypto.variation7J}>
                    <ColumnLabel className="symbolLabel" activeValue={crypto.variation7J}>{getSymbolVariation(crypto.variation7J)}</ColumnLabel>
                    <ColumnLabel activeValue={crypto.variation7J}>{getTextVariation(crypto.variation7J)}</ColumnLabel>
                  </ColumnDiv>
                </Column>
                <Column>
                  <ColumnDiv activeValueBkg={crypto.variation1M}>
                    <ColumnLabel className="symbolLabel" activeValue={crypto.variation1M}>{getSymbolVariation(crypto.variation1M)}</ColumnLabel>
                    <ColumnLabel activeValue={crypto.variation1M}>{getTextVariation(crypto.variation1M)}</ColumnLabel>
                  </ColumnDiv>
                </Column>
                <Column>
                  <ColumnDiv activeValueBkg={crypto.variation1Y}>
                    <ColumnLabel className="symbolLabel" activeValue={crypto.variation1Y}>{getSymbolVariation(crypto.variation1Y)}</ColumnLabel>
                    <ColumnLabel activeValue={crypto.variation1Y}>{getTextVariation(crypto.variation1Y)}</ColumnLabel>
                  </ColumnDiv>
                </Column>
              </Row>
            ))}
        </StyledTable>
    </Container>
  );
}

export default OwnedCryptos;