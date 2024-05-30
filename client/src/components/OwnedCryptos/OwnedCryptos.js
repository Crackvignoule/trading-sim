import React from "react";
import { Header, Container, StyledTable, LogoColumn, Column, ColumnHeader, Row, LogoColumnHeader,ColumnLabel } from "./OwnedCryptos.styles";
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

  const buildVarationText = (value) => { 
    if (value === "") {
      return "/";
    } else if (value > 0) {
        return "▲ " + value + "%";
    } else if (value < 0) {
        return "▼ " + value + "%";
    } else {
        return "─ " + value + "%";
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
                <Column><ColumnLabel activeValue={crypto.variation24H}>{buildVarationText(crypto.variation24H)}</ColumnLabel></Column>
                <Column><ColumnLabel activeValue={crypto.variation7J}>{buildVarationText(crypto.variation7J)}</ColumnLabel></Column>
                <Column><ColumnLabel activeValue={crypto.variation1M}>{buildVarationText(crypto.variation1M)}</ColumnLabel></Column>
                <Column><ColumnLabel  activeValue={crypto.variation1Y}>{buildVarationText(crypto.variation1Y)}</ColumnLabel></Column>
              </Row>
            ))}
        </StyledTable>
    </Container>
  );
}

export default OwnedCryptos;