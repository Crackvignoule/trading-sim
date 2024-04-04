import React, { useEffect, useRef } from "react";
import { widget } from "../../charting_library";
import { ChartContainer } from "./BigChart.styles";
import { useTradedPair } from "../../context/Context";

function BigChart() {
  const chartContainerRef = useRef();
  const { tradedPair, setTradedPair } = useTradedPair();

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
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      autosize: false,
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
          setTradedPair(pair);
          // console.log("pair: ", pair);
          // console.log("tradedPair: ", tradedPair);
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

export default BigChart;

// OLD CODE TO DELETE

// import React, { useEffect, useRef } from "react";

// function BigChart() {
//   const chartContainerRef = useRef();

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://s3.tradingview.com/tv.js";
//     script.async = true;
//     script.onload = () => {
//       new window.TradingView.widget({
//         container_id: chartContainerRef.current.id,
//         autosize: false,
//         symbol: "BTCUSDT",
//         interval: "1D",
//         timezone: "Etc/UTC",
//         theme: "dark",
//         style: "1",
//         locale: "en",
//         enable_publishing: false,
//         allow_symbol_change: false,
//         calendar: false,
//         hide_side_toolbar: false,
//         watchlist: ["BTC", "ETH", "SOL"],
//         overrides: {
//           "mainSeriesProperties.areaStyle.linecolor": "rgba(32, 226, 47, 1)",
//           "mainSeriesProperties.areaStyle.color1": "rgba(32, 226, 47, 0.56)",
//           "mainSeriesProperties.areaStyle.color2": "rgba(32, 226, 47, 0.04)",
//         },
//       });
//     };
//     chartContainerRef.current.appendChild(script);
//   }, []);

//   return (
//     <ChartContainer id="tradingview-widget-container" ref={chartContainerRef} />
//   );
// }

// export default BigChart;
