import React, { useEffect, useRef, useState } from "react";
import createAreaChart from "./AreaChart/AreaChart";
import { Header, ChartContainer } from "./SmallChart.styles";

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
        <button>1D</button>
        <button>1W</button>
        <button>1M</button>
        <button>1Y</button>
        <button>ALL</button>
      </Header>
      <div ref={chartContainerRef} />
    </ChartContainer>
  );
}

export default SmallChart;