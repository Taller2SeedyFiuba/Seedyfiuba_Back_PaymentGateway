const { Wallet, sequelize } = require("../database");
const { ApiError } = require("../errors/ApiError");

const bch = require("../services/blockchain");

const createWallet = async payload => {
  // This may break in some environments, keep an eye on it
  const response = await Wallet.findByPk(payload.ownerid);
  if (response) throw ApiError.badRequest("User already has a wallet");

  const wallet = bch.createWallet();

  return await Wallet.create({
    ownerid: payload.ownerid,
    address: wallet.address,
    privatekey: wallet.privateKey,
  });
};

const getWallet = async id => {
  const response = await Wallet.findByPk(id);
  if (!response) throw ApiError.notFound("Wallet not found");

  let balanceInEther = await bch.getWalletBalance(response.privatekey);

  return {
    ...response.dataValues,
    balance: balanceInEther,
  };
};

const getStatus = async () => {
  return sequelize.authenticate();
};

module.exports = {
  createWallet,
  getWallet,
  getStatus,
};
