"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};
const data = require("../database-config.js");

console.log("Conectando con base de datos: \n\t" + process.env.DATABASE_URL + "\n");

let sequelize = new Sequelize(data[process.env.NODE_ENV].url, data[process.env.NODE_ENV]);

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.checkStatus = async function(verbose=false){
  try {
    await sequelize.authenticate()
    if (verbose)
      console.log("La conexion con la base de datos se ha realizado satisfactoriamente")
    return true
  } catch (err) {
    if (verbose)
      throw Error("La conexion con la base de datos ha fallado, " + err.message)
    return false
  }
}

module.exports = db;
