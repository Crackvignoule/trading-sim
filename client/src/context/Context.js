import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const HomeContext = createContext();

// Création d'un fournisseur de contexte
export const HomeProvider = ({ children }) => {
  const [tradedPair, setTradedPair] = useState('SOL/USDT');
  const [orders, setOrders] = useState([]);
  const [ordersHistory, setOrdersHistory] = useState([]);

  // La valeur passée à tous les consommateurs du contexte
  const value = { tradedPair, setTradedPair, orders, setOrders, ordersHistory, setOrdersHistory };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

// Hook personnalisé global pour utiliser le contexte
export const useHome = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome doit être utilisé au sein d\'un HomeProvider');
  }
  return context;
};

// Hook personnalisé pour la paire échangée
export const useTradedPair = () => {
  const { tradedPair, setTradedPair } = useHome();
  return { tradedPair, setTradedPair };
};

// Hook personnalisé pour les ordres
export const useOrders = () => {
  const { orders, setOrders } = useHome();
  return { orders, setOrders };
};

// Hook personnalisé pour l'historique des ordres
export const useOrdersHistory = () => {
  const { ordersHistory, setOrdersHistory } = useHome();
  return { ordersHistory, setOrdersHistory };
};
