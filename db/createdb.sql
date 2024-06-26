DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Wallets;
DROP TABLE IF EXISTS WalletsHistory;
DROP TABLE IF EXISTS PricesHistory;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Pairs;

CREATE TABLE Users (
  idUser INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  pseudo VARCHAR(50) NOT NULL UNIQUE,
  passwordUser VARCHAR(60) NOT NULL,
  dateCrea DATETIME,
  userToken VARCHAR(255) NOT NULL
);
  
CREATE TABLE Pairs (
  idPair INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  namePair VARCHAR(25),
  nameToken VARCHAR(50),
  symbol VARCHAR(10),
  logo VARCHAR(255)
  );
  
CREATE TABLE PricesHistory (
  idPrice INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idPair INT,
  currentPrice FLOAT,
  lowestPrice FLOAT,
  highestPrice FLOAT,
  volume FLOAT,
  datePrice DATETIME,
  FOREIGN KEY (idPair) REFERENCES Pairs(idPair) ON DELETE CASCADE
);
  
CREATE TABLE WalletsHistory (
  idUser INT NOT NULL,
  total FLOAT,
  dateWallet DATETIME,
  FOREIGN KEY (idUser) REFERENCES Users(idUser) ON DELETE CASCADE
);
  
CREATE TABLE Wallets (
  idUser INT NOT NULL,
  tokenName VARCHAR(50),
  amount FLOAT,
  FOREIGN KEY (idUser) REFERENCES Users(idUser) ON DELETE CASCADE
);
  
CREATE TABLE Transactions (
  idTrans INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  pair VARCHAR(25),
  price FLOAT,
  amount FLOAT,
  total FLOAT,
  dateTrans DATETIME,
  type VARCHAR(6),
  direction VARCHAR(4),
  statut VARCHAR(15),
  FOREIGN KEY (idUser) REFERENCES Users(idUser) ON DELETE CASCADE
);

INSERT INTO Pairs (namePair,nameToken,symbol,logo) VALUES ('USDT/USDT','Tether','USDT','https://cryptologos.cc/logos/tether-usdt-logo.png');
INSERT INTO Pairs (namePair,nameToken,symbol,logo) VALUES ('BTC/USDT','Bitcoin','BTC','https://cryptologos.cc/logos/bitcoin-btc-logo.png');
INSERT INTO Pairs (namePair,nameToken,symbol,logo) VALUES ('ETH/USDT','Ethereum','ETH','https://cryptologos.cc/logos/ethereum-eth-logo.png');
INSERT INTO Pairs (namePair,nameToken,symbol,logo) VALUES ('SOL/USDT','Solana','SOL','https://cryptologos.cc/logos/solana-sol-logo.png');

CREATE INDEX idx_priceshistory_idpair ON PricesHistory(idPair);
CREATE INDEX idx_walletshistory_iduser ON WalletsHistory(idUser);
