const fs = require('fs');
const { logDebug } = require('./utils/log')
module.exports = {
  production: {
    url: process.env.DATABASE_URL,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    dialect: 'postgres',
  },
  development: {
    url: process.env.DATABASE_URL,
    logging: logDebug,
    dialect: 'postgres',
  },
  testing: {
    url: process.env.DATABASE_URL,
    logging: logDebug,
    dialect: 'postgres',
  },
};
