import React, { useEffect, useRef, useState } from "react";
import AreaChart from "./AreaChart/AreaChart";
import { theme, Header, SmallChartContainer, Button, Div } from "./SmallChart.styles";
import { ThemeProvider } from '@mui/material/styles';

function SmallChart() {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [series, setSeries] = useState(null);

    useEffect(() => {
    if (!chartRef.current) {
        const data = [
          { time: Date.parse('2018-10-22 00:00')/1000, value: 35.75 },
          { time: Date.parse('2018-10-22 01:00')/1000, value: 35.77 },
          { time: Date.parse('2018-10-22 02:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-22 03:00')/1000, value: 35.72 },
          { time: Date.parse('2018-10-22 04:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-22 05:00')/1000, value: 35.84 },
          { time: Date.parse('2018-10-22 06:00')/1000, value: 35.76 },
          { time: Date.parse('2018-10-22 07:00')/1000, value: 35.83 },
          { time: Date.parse('2018-10-22 08:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-22 09:00')/1000, value: 35.85 },
          { time: Date.parse('2018-10-22 10:00')/1000, value: 35.88 },
          { time: Date.parse('2018-10-22 11:00')/1000, value: 35.77 },
          { time: Date.parse('2018-10-22 12:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-22 13:00')/1000, value: 35.74 },
          { time: Date.parse('2018-10-22 14:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-22 15:00')/1000, value: 35.82 },
          { time: Date.parse('2018-10-22 16:00')/1000, value: 35.76 },
          { time: Date.parse('2018-10-22 17:00')/1000, value: 35.8 },
          { time: Date.parse('2018-10-22 18:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-22 19:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-22 20:00')/1000, value: 35.83 },
          { time: Date.parse('2018-10-22 21:00')/1000, value: 35.78 },
          { time: Date.parse('2018-10-22 22:00')/1000, value: 35.8 },
          { time: Date.parse('2018-10-22 23:00')/1000, value: 35.82 },
          { time: Date.parse('2018-10-23 00:00')/1000, value: 35.76 },
          { time: Date.parse('2018-10-23 01:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-23 02:00')/1000, value: 35.83 },
          { time: Date.parse('2018-10-23 03:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-23 04:00')/1000, value: 35.75 },
          { time: Date.parse('2018-10-23 05:00')/1000, value: 35.78 },
          { time: Date.parse('2018-10-23 06:00')/1000, value: 35.84 },
          { time: Date.parse('2018-10-23 07:00')/1000, value: 35.8 },
          { time: Date.parse('2018-10-23 08:00')/1000, value: 35.77 },
          { time: Date.parse('2018-10-23 09:00')/1000, value: 35.83 },
          { time: Date.parse('2018-10-23 10:00')/1000, value: 35.76 },
          { time: Date.parse('2018-10-23 11:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-23 12:00')/1000, value: 35.85 },
          { time: Date.parse('2018-10-23 13:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-23 14:00')/1000, value: 35.77 },
          { time: Date.parse('2018-10-23 15:00')/1000, value: 35.82 },
          { time: Date.parse('2018-10-23 16:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-23 17:00')/1000, value: 35.84 },
          { time: Date.parse('2018-10-23 18:00')/1000, value: 35.78 },
          { time: Date.parse('2018-10-23 19:00')/1000, value: 35.81 },
          { time: Date.parse('2018-10-23 20:00')/1000, value: 35.79 },
          { time: Date.parse('2018-10-23 21:00')/1000, value: 35.83 },
          { time: Date.parse('2018-10-23 22:00')/1000, value: 35.77 },
          { time: Date.parse('2018-10-23 23:00')/1000, value: 35.82 },
        ];
        chartRef.current = AreaChart(chartContainerRef.current, data);
    }
}, []);

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