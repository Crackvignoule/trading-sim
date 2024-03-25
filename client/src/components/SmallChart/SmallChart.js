import React, { useEffect, useRef, useState } from "react";
import createAreaChart from "./AreaChart/AreaChart";
import { ChartContainer } from "./SmallChart.styles";

function SmallChart() {
    const chartContainerRef = useRef();
    const chartRef = useRef();

    const [series, setSeries] = useState(null);

    // Initialisation du graphique et chargement des données historiques
    useEffect(() => {
        console.log('Création du graphique');
        // Videz le conteneur avant de créer un nouveau graphique
        chartContainerRef.current.innerHTML = '';
    
        fetch('http://localhost:5000/api/chartBTCUSDT')
            .then(response => response.json())
            .then(data => {
                const { chart, series } = createAreaChart(chartContainerRef.current, data);
                setSeries(series);
            })
            .catch(error => console.error("Erreur lors de la récupération des données historiques:", error));
    }, []);

    return <ChartContainer ref={chartContainerRef} />;
}

export default SmallChart;
