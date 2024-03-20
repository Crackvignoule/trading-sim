import React, { useState, useEffect } from 'react';
import Chart from '../../components/Chart/Chart';

function Home() {
    const [data, setData] = useState(null); // Ajout d'un état pour stocker les données de l'API

    useEffect(() => {
        // Appel à l'API dès que le composant est monté
        fetch('/api')
            .then(response => response.json())
            .then(data => setData(data)) // Mise à jour de l'état avec les données reçues
            .catch(error => console.error("Erreur lors de la récupération des données:", error));
    }, []); // Le tableau vide comme second argument signifie que cet effet ne s'exécute qu'après le premier rendu du composant

    return (
      <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of our application.</p>
        {/* Conditionnellement afficher les données de l'API ou un message de chargement */}
        {data ? (
            <div>
                <p>Données reçues de l'API: {JSON.stringify(data)}</p>
                <Chart data={data} /> {/* Supposant que votre composant Chart peut prendre des données en tant que prop */}
            </div>
        ) : (
            <p>Chargement des données...</p>
        )}
      </div>
    );
}

export default Home;
