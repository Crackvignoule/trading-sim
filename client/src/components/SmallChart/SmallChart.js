import React, { useEffect, useRef, useState } from "react";
import AreaChart from "./AreaChart/AreaChart";
import { theme, Header, SmallChartContainer, Button, Div } from "./SmallChart.styles";
import { ThemeProvider } from '@mui/material/styles';

const getUserHistory = async () => {
  const userToken = localStorage.getItem('token');
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}:5000/api/get-user-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: userToken }),
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

function SmallChart() {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [series, setSeries] = useState(null);

  useEffect(() => {
    getUserHistory().then(result => {
      if (result && Array.isArray(result)) {
        const chartData = result.map(item => {
          const time = Date.parse(item.dateWallet) / 1000;
          return {
            time,
            value: item.total,
          };
        });
        setSeries(chartData);
      }
    });
  }, []);

useEffect(() => {
  if (!chartRef.current && series) {
    chartRef.current = AreaChart(chartContainerRef.current, series);
  }
}, [series]);

  return (
    <SmallChartContainer>
      <Header>
        <ThemeProvider theme={theme}>
        <Button id="oneHour">1H</Button>
        <Button id="oneDay">1D</Button>
        <Button id="oneWeek">1W</Button>
        <Button id="oneMonth">1M</Button>
        <Button id="oneYear">1Y</Button>
        <Button id="all">ALL</Button>
        </ThemeProvider>
      </Header>
      <Div ref={chartContainerRef} />
    </SmallChartContainer>
  );
}

export default SmallChart;