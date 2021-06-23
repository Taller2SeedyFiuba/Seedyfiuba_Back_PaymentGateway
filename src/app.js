const express = require("express");
const json = require("express").json;
const morgan = require("morgan");
const cors = require("cors");

//Documentacion de swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//Importamos rutas/endpoints
const { getWalletsRouter } = require("./routes/wallet");

const { getAPIStatus } = require("./controllers/status");

//Importamos handlers de error
const { notDefinedHandler, errorHandler, hocError } = require("./errors/handler");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Servicio de Usuarios",
      description: "API del servicio de usuarios para el TP SeedyFiuba de Taller 2 FIUBA",
      contact: {
        name: "SeedyFiuba",
        url: "https://github.com/Taller2SeedyFiuba",
      },
      version: "1.0.0",
      //servers: ['http://localhost:8080']
    },
  },
  apis: ["src/routes/users.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

function createApp(database, log = true) {
  //Iniciamos la aplicacion
  const app = express();

  //Middlewares
  if (log) app.use(morgan("dev")); //Escupir a archivo con una ip y timestamp.
  app.use(cors());
  app.use(json());

  //Rutas
  app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use("/api/status", hocError(getAPIStatus));
  app.use("/api/wallets", getWalletsRouter());

  app.use(notDefinedHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
