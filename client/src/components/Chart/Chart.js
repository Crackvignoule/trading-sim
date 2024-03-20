import React, { useEffect, useRef, useState } from 'react';
import createLineChart from './LineChart/LineChart';
import { ChartContainer } from './Chart.styles';

function Chart() {
    const chartContainerRef = useRef();
    const [series, setSeries] = useState(null);

    // Initialisation du graphique et chargement des données historiques
    useEffect(() => {
        console.log('Création du graphique');
        // Videz le conteneur avant de créer un nouveau graphique
        chartContainerRef.current.innerHTML = '';
    
        fetch('http://localhost:5000/api/chartBTCUSDT')
            .then(response => response.json())
            .then(data => {
                const { chart, series } = createLineChart(chartContainerRef.current, data);
                setSeries(series);
            })
            .catch(error => console.error("Erreur lors de la récupération des données historiques:", error));
    }, []);
    

    // Écoute des mises à jour en temps réel via WebSocket
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => console.log('WebSocket Connected');
        ws.onmessage = event => {
            const newData = JSON.parse(event.data);
            series?.update(newData[0]); // Utilisez la méthode update pour ajouter la nouvelle donnée
        };
        ws.onerror = error => console.error('WebSocket Error:', error);
        ws.onclose = () => console.log('WebSocket Disconnected');

        return () => ws.close();
    }, [series]); // Ajoutez series comme dépendance pour s'assurer qu'elle est définie

    return <ChartContainer ref={chartContainerRef} />;
}

export default Chart;
