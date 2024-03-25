import { createChart } from "lightweight-charts";

var darkTheme = {
  chart: {
    layout: {
      background: {
        type: "solid",
        color: "#2B2B43",
      },
      lineColor: "#2B2B43",
      textColor: "#D9D9D9",
    },
    watermark: {
      color: "rgba(0, 0, 0, 0)",
    },
    crosshair: {
      color: "#758696",
    },
    grid: {
      vertLines: {
        color: "#2B2B43",
      },
      horzLines: {
        color: "#363C4E",
      },
    },
  },
  series: {
    topColor: "rgba(32, 226, 47, 0.56)",
    bottomColor: "rgba(32, 226, 47, 0.04)",
    lineColor: "rgba(32, 226, 47, 1)",
    lineWidth: 2,
  },
};

function generateOptions(theme) {
  let options = {};
  for (let key in theme) {
    if (typeof theme[key] === "object") {
      options[key] = generateOptions(theme[key]);
    } else {
      options[key] = theme[key];
    }
  }
  return options;
}

function timeScalingButtons(chart) {
  const buttons = {
    "oneHour": (date) => date.setHours(date.getHours() - 1),
    "oneDay": (date) => date.setDate(date.getDate() - 1),
    "oneWeek": (date) => date.setDate(date.getDate() - 7),
    "oneMonth": (date) => date.setMonth(date.getMonth() - 1),
    "oneYear": (date) => date.setFullYear(date.getFullYear() - 1),
    "all": null,
  };

  Object.entries(buttons).forEach(([id, setDate]) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      if (setDate) {
        const date = new Date();
        setDate(date);
        chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
      } else {
        chart.timeScale().fitContent();
      }
    });
  });
}

function createAreaChart(container, data) {
  const chart = createChart(container, generateOptions(darkTheme.chart));
  const areaSeries = chart.addAreaSeries(generateOptions(darkTheme.series));

  timeScalingButtons(chart);

  areaSeries.setData(data);
  chart.timeScale().fitContent();

  // Set the chart's initial size to match its container's size
  chart.resize(container.clientWidth, container.clientHeight);

  // Make the chart responsive
  window.addEventListener("resize", () => {
    chart.resize(container.clientWidth, container.clientHeight);
  });

  return { chart, series: areaSeries };
}

export default createAreaChart;
