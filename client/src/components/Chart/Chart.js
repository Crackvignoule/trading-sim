import React, { useEffect, useRef } from "react";
import { ChartContainer } from "./Chart.styles";

function Chart() {
  const chartContainerRef = useRef();

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
        allow_symbol_change: true,
        calendar: false,
        hide_side_toolbar: false,
        watchlist: ["AAPL", "IBM", "TSLA", "AMD", "MSFT", "GOOG"],
        overrides: {
          "mainSeriesProperties.areaStyle.linecolor": "rgba(32, 226, 47, 1)",
          "mainSeriesProperties.areaStyle.color1": "rgba(32, 226, 47, 0.56)",
          "mainSeriesProperties.areaStyle.color2": "rgba(32, 226, 47, 0.04)",
        },
        searchSymbols: async (
          userInput,
          exchange,
          symbolType,
          onResultReadyCallback,
      ) => {
          console.log('[searchSymbols]: Method call');
          // const symbols = await getMatchingSymbolsFromBackend(userInput, exchange, symbolType);
          // onResultReadyCallback(newSymbols);
      }
      }
      );
    };
    chartContainerRef.current.appendChild(script);
  }, []);

  return (
    <ChartContainer id="tradingview-widget-container" ref={chartContainerRef} />
  );
}

export default Chart;
