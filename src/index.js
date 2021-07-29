const { createApp } = require("./app");
const db = require("./database");
const { logError, logDebug }  = require('./utils/log')
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV;

const main = async function(){
  await db.checkStatus(verbose=true);
  const app = createApp();
  app.listen(PORT, () => {
    logDebug(`Servidor escuchando en http://localhost:${PORT}`);
    logDebug(`Corriendo en modo: ${ENV}`);
  });

}

main()
  .catch(err => {
    logError(err.message)
  });
