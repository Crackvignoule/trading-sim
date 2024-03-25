import React, { useEffect, useRef, useState } from "react";
import createAreaChart from "./AreaChart/AreaChart";
import { Header, ChartContainer, Button, Div } from "./SmallChart.styles";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#F5C326',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#F5C326',
    },
  },
});

function SmallChart() {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  const [series, setSeries] = useState(null);

  useEffect(() => {
    console.log("Création du graphique");
    chartContainerRef.current.innerHTML = "";

    fetch("http://localhost:5000/api/chartBTCUSDT")
      .then((response) => response.json())
      .then((data) => {
        const { chart, series } = createAreaChart(
          chartContainerRef.current,
          data
        );
        setSeries(series);
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des données historiques:",
          error
        )
      );
  }, []);

  return (
    <ChartContainer>
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
    </ChartContainer>
  );
}

export default SmallChart;