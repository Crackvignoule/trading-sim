import React, { useEffect, useRef, useState } from 'react';
import createLineChart from './LineChart/LineChart';
import { ChartContainer } from './Chart.styles';

function ChartComponent() {
    const chartContainerRef = useRef();
    const chartRef = useRef();
	const [data, setData] = useState([]);

	useEffect(() => {
        // Fonction pour récupérer les données du serveur
        const fetchData = async () => {
            try {
                const response = await fetch('/api/chart');
                const data = await response.json();
                setData(data); // Mise à jour de l'état avec les données récupérées
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Assurez-vous que les données sont chargées avant de tenter de créer le graphique
        if (data.length > 0 && !chartRef.current) {
            chartRef.current = createLineChart(chartContainerRef.current, data);
        }
    }, [data]);

    return <ChartContainer ref={chartContainerRef} />;
}

export default ChartComponent;