const express = require("express");
const json = require("express").json;
const morgan = require("morgan");
const cors = require("cors");

//Importamos rutas/endpoints
const { getWalletsRouter } = require("./routes/wallet");

const { getAPIStatus } = require("./controllers/status");

//Importamos handlers de error
const { notDefinedHandler, errorHandler, hocError } = require("./errors/handler");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');

function createApp(database, log = true) {
  //Iniciamos la aplicacion
  const app = express();

  //Middlewares
  if (log) app.use(morgan("dev")); //Escupir a archivo con una ip y timestamp.
  app.use(cors());
  app.use(json());

  //Rutas
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  app.use("/api/status", hocError(getAPIStatus));
  app.use("/api/wallets", getWalletsRouter());

  app.use(notDefinedHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
