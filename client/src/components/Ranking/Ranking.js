import React, { useEffect, useState } from 'react';
import { Tr, Td, StyledTable } from "./Ranking.styles";
import Rank from "./Rank/Rank";

function Ranking() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const ws5 = new WebSocket(`ws://${process.env.REACT_APP_SERVER_URL}:8888`);
    ws5.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws5.onmessage = (event) => {
      const newEntries = JSON.parse(event.data);

      // Flatten the nested array
      const flattenedEntries = newEntries.flat();

      setLeaderboard(prevLeaderboard => {
        const updatedLeaderboard = flattenedEntries.map(newEntry => {
          const index = prevLeaderboard.findIndex(entry => entry.idUser === newEntry.idUser);
          if (index !== -1) {
            // Replace the existing entry with the new entry
            return { ...prevLeaderboard[index], ...newEntry };
          } else {
            // Add the new entry if it doesn't exist
            return newEntry;
          }
        });

        // Filter out duplicates and ensure uniqueness
        const uniqueLeaderboard = [
          ...updatedLeaderboard.reduce((map, entry) => map.set(entry.idUser, entry), new Map()).values()
        ];

        return uniqueLeaderboard;
      });
    };

    return () => {
      ws5.close();
    };
  }, []);

  // Format time played from seconds to a more readable format (HH:MM:SS)
  const formatTimePlayed = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

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
      {leaderboard.map((entry, index) => {
        return (
          <Tr key={entry.idUser}>
            <Td><Rank rank={index + 1} /></Td>
            <Td>{entry.pseudo}</Td>
            <Td>{typeof entry.latest_total === 'number' ? entry.latest_total.toFixed(2) : 'N/A'}</Td>
            <Td>{typeof entry.evolution_24h === 'number' ? entry.evolution_24h.toFixed(2) : 'N/A'}</Td>
            <Td>{formatTimePlayed(entry.time_played_seconds)}</Td>
          </Tr>
        );
      })}
      </tbody>
    </StyledTable>
  );
}

export default Ranking;
