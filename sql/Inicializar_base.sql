SET SEARCH_PATH TO 'public';

CREATE TYPE TRANSACTION_TYPE AS ENUM ('deposit', 'withdraw');

-- CREATE EXTENSION postgis;

DROP TABLE IF EXISTS wallets;

CREATE TABLE wallets(
	ownerid VARCHAR(255) NOT NULL,
	address VARCHAR(255) NOT NULL,
	privatekey VARCHAR(255) NOT NULL,
	creationdate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE wallets ADD CONSTRAINT pk_wallets PRIMARY KEY(ownerid);

DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions(
  transactionId VARCHAR(255) NOT NULL,
  ownerid VARCHAR(255) NOT NULL,
  projectid INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  type TRANSACTION_TYPE NOT NULL,
  creationdate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ADD CONSTRAINT pk_transactions PRIMARY KEY(transactionId);
ALTER TABLE transactions ADD CONSTRAINT fk_transactions FOREIGN KEY(ownerid) REFERENCES wallets(ownerid) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions FOREIGN KEY(projectid) REFERENCES projects(projectid) ON DELETE CASCADE;

