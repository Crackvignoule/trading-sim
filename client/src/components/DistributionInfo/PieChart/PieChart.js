import React, { useState, useEffect } from 'react';
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieActiveArc() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const fetchedData = result.data.map((item, index) => ({
          id: index,
          value: parseFloat(item.value),
          label: item.nameToken,
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          innerRadius: 120,
          outerRadius: 160,
          cornerRadius: 10,
          paddingAngle: 1,
        },
      ]}
      slotProps={{
        legend: {
          labelStyle: {
            fill: "white",
          },
        },
      }}
      height={350}
    />
  );
}
