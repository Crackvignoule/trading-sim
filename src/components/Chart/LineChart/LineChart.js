import { createChart, CrosshairMode, LineStyle } from 'lightweight-charts';

var darkTheme = {
	chart: {
		layout: {
			background: {
				type: 'solid',
				color: '#2B2B43',
			},
			lineColor: '#2B2B43',
			textColor: '#D9D9D9',
		},
		watermark: {
			color: 'rgba(0, 0, 0, 0)',
		},
		crosshair: {
			color: '#758696',
		},
		grid: {
			vertLines: {
				color: '#2B2B43',
			},
			horzLines: {
				color: '#363C4E',
			},
		},
	},
	series: {
			topColor: 'rgba(32, 226, 47, 0.56)',
			bottomColor: 'rgba(32, 226, 47, 0.04)',
			lineColor: 'rgba(32, 226, 47, 1)',
	},
};

function createLineChart(container, data) {
    const chart = createChart(container, {
        layout: {
			background: {
				type: darkTheme.chart.layout.background.type,
				color: darkTheme.chart.layout.background.color,
			},
			lineColor: darkTheme.chart.layout.lineColor,
			textColor: darkTheme.chart.layout.textColor,
		},
		watermark: {
			color: darkTheme.chart.watermark.color,
		},
		crosshair: {
			color: darkTheme.chart.crosshair.color,
		},
		grid: {
			vertLines: {
				color: darkTheme.chart.grid.vertLines.color,
			},
			horzLines: {
				color: darkTheme.chart.grid.horzLines.color,
			},
		},
    });

    const areaSeries = chart.addAreaSeries({
        topColor: darkTheme.series.topColor,
        bottomColor: darkTheme.series.bottomColor,
        lineColor: darkTheme.series.lineColor,
        lineWidth: 2,
    });

    areaSeries.setData(data);

    return chart;
}

export default createLineChart;