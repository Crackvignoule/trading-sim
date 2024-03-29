import React, { useEffect, useRef } from "react";
import { ChartContainer } from "./BigChart.styles";
import { useTradedPair } from '../../context/Context';

function BigChart() {
  const chartContainerRef = useRef();

  const { tradedPair, setTradedPair } = useTradedPair(); // Récupéré de TradedPairContext

  const handlePairChange = (newPair) => {
      setTradedPair(newPair); // Mettre à jour la paire actuelle
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        container_id: chartContainerRef.current.id,
        autosize: false,
        symbol: "BTCUSDT",
        interval: "1D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        calendar: false,
        hide_side_toolbar: false,
        watchlist: ["BTC", "ETH", "SOL"],
        overrides: {
          "mainSeriesProperties.areaStyle.linecolor": "rgba(32, 226, 47, 1)",
          "mainSeriesProperties.areaStyle.color1": "rgba(32, 226, 47, 0.56)",
          "mainSeriesProperties.areaStyle.color2": "rgba(32, 226, 47, 0.04)",
        },
      });
    };
    chartContainerRef.current.appendChild(script);
    setTradedPair("BTC/USDT"); //Pair par défault
  }, []);

  return (
    <ChartContainer id="tradingview-widget-container" ref={chartContainerRef} />
  );
}

export default BigChart;