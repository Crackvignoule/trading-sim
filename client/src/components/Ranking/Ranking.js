import React from "react";
import { LeaderboardData } from "../../constants/constants";
import { Tr, Td, StyledTable } from "./Ranking.styles";
import Rank from "./Rank/Rank";

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
              <Rank rank={data.rank} />
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