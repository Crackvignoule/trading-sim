import React from "react";
import { LeaderboardData } from "../../constants/constants";
import { Tr, Td, StyledTable } from "./Ranking.styles";
import { BsFillHexagonFill } from "react-icons/bs";

function Ranking() {
  return (
    <StyledTable>
          <thead>
            <Tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Value</th>
              <th>24h Evolution</th>
              <th>Time Played</th>
            </Tr>
          </thead>
          <tbody>
          {LeaderboardData.map((data) => (
            <Tr key={data.rank}>
              <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                <BsFillHexagonFill color={data.rank <= 3 ? 'gold' : 'white'} />
                <span style={{ position: 'absolute' }}>{data.rank}</span>
              </div>
              <td>{data.username}</td>
              <td>{data.totalValue}</td>
              <Td className={data.evolution.startsWith('+') ? 'positive' : 'negative'}>{data.evolution}</Td>
              <td>{data.timePlayed}</td>
            </Tr>
          ))}
          </tbody>
    </StyledTable>
  );
}

export default Ranking;