import React from "react";
import { LeaderboardData } from "../../constants/constants";
import { Tr, StyledTable } from "./Leaderboard.styles"
function Leaderboard() {
    return (
      <div>
        <StyledTable>
          <thead>
            <Tr>
              <h>Rank</h>
              <h>Username</h>
              <h>Total Value</h>
              <h>24h Evolution</h>
              <h>Time Played</h>
            </Tr>
          </thead>
          <tbody>
            {LeaderboardData.map((data) => (
              <Tr key={data.rank}>
                <td>{data.rank}</td>
                <td>{data.username}</td>
                <td>{data.totalValue}</td>
                <td>{data.evolution}</td>
                <td>{data.timePlayed}</td>
              </Tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    );
  }
  
  export default Leaderboard;