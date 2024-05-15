import React, { useEffect } from "react";
import { LeaderboardData } from "../../constants/constants";
import { Tr, Td, StyledTable } from "./Ranking.styles";
import Rank from "./Rank/Rank";

function Ranking() {
  useEffect(() => {
    const ws5 = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}:8888`); // replace <wss5-port> with the actual port number
    ws5.onopen = () => {
      console.log('Connexion WebSocket5 établie');
    };

    // Listen for incoming messages
    ws5.onmessage = (event) => {
      const leaderboardData = JSON.parse(event.data);
      console.log('Received leaderboard data:', leaderboardData);
      // Update your state or props with the received leaderboard data
    };

    // Clean up by closing the WebSocket connection when the component unmounts
    return () => {
      ws5.close();
    };
  }, []);

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