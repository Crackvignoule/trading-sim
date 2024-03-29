import React, { createContext, useState, useContext } from 'react';

// Création du contexte
const TradedPairContext = createContext();

// Création d'un fournisseur de contexte
export const TradedPairProvider = ({ children }) => {
  const [tradedPair, setTradedPair] = useState('BTC/USDT'); // Valeur initiale

  // La valeur passée à tous les consommateurs du contexte
  const value = { tradedPair, setTradedPair };

  return (
    <TradedPairContext.Provider value={value}>
      {children}
    </TradedPairContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useTradedPair = () => {
  const context = useContext(TradedPairContext);
  if (context === undefined) {
    throw new Error('useTradedPair doit être utilisé au sein d\'un TradedPairProvider');
  }
  return context;
};
