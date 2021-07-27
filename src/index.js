const { createApp } = require("./app");
const db = require("./database");
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV;

const main = async function(){
  try {
    await db.checkStatus(verbose=true);
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`Corriendo en modo: ${ENV}`);
    });
  } catch (e) {
    console.log(e.message);
  }
}

main()
  .catch(err => {
    logError(err.message)
  });