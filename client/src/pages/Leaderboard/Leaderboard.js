import React from "react";
import { LeaderboardData } from "../../constants/constants";
import { Tr, Td, StyledTable } from "./Leaderboard.styles"
import { BsFillHexagonFill } from "react-icons/bs";

function Leaderboard() {
    return (
      <div>
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
              <td><BsFillHexagonFill color={data.rank <= 3 ? 'gold' : 'white'} />{data.rank}</td>
              <td>{data.username}</td>
              <td>{data.totalValue}</td>
              <Td className={data.evolution.startsWith('+') ? 'positive' : 'negative'}>{data.evolution}</Td>
              <td>{data.timePlayed}</td>
            </Tr>
          ))}
          </tbody>
        </StyledTable>
      </div>
    );
  }
  
  export default Leaderboard;