import React, { useEffect, useRef } from "react";
import { widget } from "../../charting_library";
import { ChartContainer } from "./BigChart.styles";

function BigChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const widgetOptions = {
      symbol: "AAPL",
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        "https://demo_feed.tradingview.com"
      ),
      interval: "D",
      container: chartContainerRef.current,
      library_path: "/charting_library/",
      theme: "dark",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
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
          const currentSymbol = tvWidget.activeChart().symbol();
          console.log("The symbol is changed to:", currentSymbol);
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
