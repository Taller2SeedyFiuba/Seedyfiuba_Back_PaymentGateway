const express = require("express");
const json = require("express").json;
const morgan = require("morgan");
const cors = require("cors");
const { log } = require('./config')

//Importamos rutas/endpoints
const { getWalletsRouter } = require("./routes/wallet");
const { getProjectsRouter } = require("./routes/project");

const { getAPIStatus } = require("./controllers/status");

//Importamos handlers de error
const { notDefinedHandler, errorHandler, hocError } = require("./errors/handler");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

function createApp() {
  //Iniciamos la aplicacion
  const app = express();

  //Middlewares
  if(log.info){
    app.use(morgan(function (tokens, req, res) {
      return [
        'Info:',
        tokens.method(req, res),
        tokens.url(req, res), '-',
        tokens.status(req, res), '-',
        tokens['response-time'](req, res), 'ms'
      ].join(' ')
    }));
  }
  app.use(cors());
  app.use(json());

  //Rutas
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api/status", hocError(getAPIStatus));
  app.use("/api/wallets", getWalletsRouter());
  app.use("/api/projects", getProjectsRouter());

  app.use(notDefinedHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
