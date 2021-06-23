"use strict";
module.exports = (sequelize, DataTypes) => {
  var Wallet = sequelize.define(
    "Wallet",
    {
      ownerid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      address: DataTypes.STRING,
      privatekey: DataTypes.STRING,
      creationdate: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "wallets",
      timestamps: false,
    },
  );

  Wallet.beforeCreate((user, options) => {
    user.createdate = new Date().toISOString();
  });

  return Wallet;
};
