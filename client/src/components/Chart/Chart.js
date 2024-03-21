import React, { useEffect, useRef, memo } from 'react';
import { ChartContainer } from './Chart.styles';

function TradingViewWidget() {
    const chartContainerRef = useRef();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget({
                container_id: chartContainerRef.current.id,
                autosize: false,
                symbol: 'CRYPTOCAP:BTC',
                interval: '1S',
                timezone: 'Etc/UTC',
                theme: 'dark',
                style: '1',
                locale: 'en',
                enable_publishing: false,
                allow_symbol_change: true,
                calendar: false,
				hide_side_toolbar: false,
				overrides: {
					"mainSeriesProperties.areaStyle.linecolor": "rgba(32, 226, 47, 1)",
					"mainSeriesProperties.areaStyle.color1": "rgba(32, 226, 47, 0.56)",
					"mainSeriesProperties.areaStyle.color2": "rgba(32, 226, 47, 0.04)",
				  },
            });
        };
        chartContainerRef.current.appendChild(script);
    }, []);

    return (
        <ChartContainer id='tradingview-widget-container' ref={chartContainerRef} />
    );
}

export default TradingViewWidget;

// OLD CODE
// import React, { useEffect, useRef, useState } from 'react';
// import createAreaChart from './AreaChart/AreaChart';
// import { ChartContainer } from './Chart.styles';
// import ToolBarChart from './ToolBarChart/ToolBarChart';

// function Chart({ showToolbar = false }) {
//     const chartContainerRef = useRef();
//     const [series, setSeries] = useState(null);

//     // Initialisation du graphique et chargement des données historiques
//     useEffect(() => {
//         console.log('Création du graphique');
//         // Videz le conteneur avant de créer un nouveau graphique
//         chartContainerRef.current.innerHTML = '';
    
//         fetch('http://localhost:5000/api/chartBTCUSDT')
//             .then(response => response.json())
//             .then(data => {
//                 const { chart, series } = createAreaChart(chartContainerRef.current, data);
//                 setSeries(series);
//             })
//             .catch(error => console.error("Erreur lors de la récupération des données historiques:", error));
//     }, []);
    

//     // Écoute des mises à jour en temps réel via WebSocket
//     useEffect(() => {
//         const ws = new WebSocket('ws://localhost:8080');

//         ws.onopen = () => console.log('WebSocket Connected');
//         ws.onmessage = event => {
//             const newData = JSON.parse(event.data);
//             series?.update(newData[0]); // Utilisez la méthode update pour ajouter la nouvelle donnée
//         };
//         ws.onerror = error => console.error('WebSocket Error:', error);
//         ws.onclose = () => console.log('WebSocket Disconnected');

//         return () => ws.close();
//     }, [series]); // Ajoutez series comme dépendance pour s'assurer qu'elle est définie

//     return (
//         <div>
//             {showToolbar && <ToolBarChart />}
//             <ChartContainer ref={chartContainerRef} />
//         </div>
//     );
// }

// export default Chart;
