import React, { useEffect, useRef } from "react";
import { widget } from "../../charting_library";
import { ChartContainer } from "./BigChart.styles";
import { useSelector, useDispatch } from 'react-redux';

function BigChart() {
  const chartContainerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const widgetOptions = {
      symbol: "BTCUSDT",
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        "http://localhost:9090"
      ),
      interval: "D",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      theme: "dark",
      disabled_features: ["use_localstorage_for_settings", "timeframes_toolbar"],
      enabled_features: ["study_templates", "items_favoriting"],
      autosize: false,
      favorites: {
        intervals: ["1", "60", "1D", "1W", "1M"],
        chartTypes: ["Area", "Candles"],
      },
      overrides: {
        "mainSeriesProperties.areaStyle.linecolor": "rgba(32, 226, 47, 1)",
        "mainSeriesProperties.areaStyle.color1": "rgba(32, 226, 47, 0.56)",
        "mainSeriesProperties.areaStyle.color2": "rgba(32, 226, 47, 0.04)",
      },
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      // Track symbol changes
      tvWidget
        .activeChart()
        .onSymbolChanged()
        .subscribe(null, () => {
          const currentSymbol = tvWidget.activeChart().symbolExt();
          const token1 = currentSymbol.description.split("/")[0];
          const token2 = currentSymbol.description.split("/")[1];
          const pair = token1.trim() + "/" + token2.trim();
          dispatch({ type: 'SET_TRADED_PAIR', value: pair });
        });
    });

    return () => {
      tvWidget.remove();
    };
    

  });
  
  return (
    <ChartContainer ref={chartContainerRef} className={"TVChartContainer"} />
  );
}

export default React.memo(BigChart);