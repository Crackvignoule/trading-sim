import React from "react";
import { Header, Container, StyledTable, Td } from "./OwnedCryptos.styles";
import { cryptos } from "../../constants/constants";

function OwnedCryptos() {
  return (
    <Container>
        <Header>
            Owned Cryptos
        </Header>
        <StyledTable>
            <tr>
                <th>Crypto</th>
                <th>Amount</th>
                <th>AVG</th>
                <th>Value</th>
                <th>24h</th>
                <th>7d</th>
                <th>1m</th>
                <th>1y</th>
            </tr>
            {cryptos.map((crypto) => (
              <tr key={crypto.name}>
                <Td>
                  <img src={crypto.icon} alt={crypto.name} style={{width: '30px', marginRight: '10px'}} />
                  {crypto.name} ({crypto.symbol})
                </Td>
                <td>{crypto.amount}</td>
                <td>{crypto.avg}</td>
                {/* Add more cells as needed */}
              </tr>
            ))}
        </StyledTable>
    </Container>
  );
}

export default OwnedCryptos;