import { createChart } from 'lightweight-charts';

var darkTheme = {
	chart: {
        width: 600,
        height: 400,
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
            lineWidth: 2,
	},
};

function generateOptions(theme) {
    let options = {};
    for (let key in theme) {
        if (typeof theme[key] === 'object') {
            options[key] = generateOptions(theme[key]);
        } else {
            options[key] = theme[key];
        }
    }
    return options;
}

function createLineChart(container, data) {
    const chart = createChart(container, generateOptions(darkTheme.chart));
    const areaSeries = chart.addAreaSeries(generateOptions(darkTheme.series));

    areaSeries.setData(data);
    chart.timeScale().fitContent();

    return { chart, series: areaSeries };
}


export default createLineChart;