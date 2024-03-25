import { createChart } from "lightweight-charts";

var darkTheme = {
  chart: {
    width: 600,
    height: 400,
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
  const oneHour = document.getElementById("oneHour");
  const oneDay = document.getElementById("oneDay");
  const oneWeek = document.getElementById("oneWeek");
  const oneMonth = document.getElementById("oneMonth");
  const oneYear = document.getElementById("oneYear");
  const all = document.getElementById("all");

  oneHour.addEventListener('click', () => {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
  });

  oneDay.addEventListener('click', () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
  });

  oneWeek.addEventListener('click', () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
  });

  oneMonth.addEventListener('click', () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
  });

  oneYear.addEventListener('click', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    chart.timeScale().setVisibleRange({ from: date.getTime() / 1000, to: Date.now() / 1000 });
  });

  all.addEventListener('click', () => {
    chart.timeScale().fitContent();
  });
}

function createAreaChart(container, data) {
  console.log(darkTheme.chart.width);

  const chart = createChart(container, generateOptions(darkTheme.chart));
  const areaSeries = chart.addAreaSeries(generateOptions(darkTheme.series));

  timeScalingButtons(chart);

  areaSeries.setData(data);
  chart.timeScale().fitContent();

  // Make the chart responsive
  window.addEventListener("resize", () => {
    chart.resize(container.clientWidth, container.clientHeight);
  });

  return { chart, series: areaSeries };
}

export default createAreaChart;
