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

DROP TABLE IF EXISTS projects;

CREATE TABLE projects(
  projectid INTEGER PRIMARY KEY,
  ownerid VARCHAR(255) NOT NULL,
  smcid INTEGER NOT NULL
);

ALTER TABLE projects ADD CONSTRAINT fk_projects FOREIGN KEY(ownerid) REFERENCES wallets(ownerid) ON DELETE CASCADE;
