const { Wallet, sequelize } = require("../database");
const { ApiError } = require("../errors/ApiError");
const errMsg = require('../errors/messages')
const bch = require("../services/blockchain");

const createWallet = async payload => {
  // This may break in some environments, keep an eye on it
  const response = await Wallet.findByPk(payload.ownerid);
  if (response) throw ApiError.badRequest(errMsg.USER_ALREADY_HAS_WALLET);

  let wallet = 0;
  let found = true;

  while(found){
    wallet = bch.createWallet();
    found = await Wallet.findOne({
      'where': {
        address: wallet.address,
        privatekey: wallet.privateKey,
      }
    })
  }

  return await Wallet.create({
    ownerid: payload.ownerid,
    address: wallet.address,
    privatekey: wallet.privateKey,
  });
};

const getWallet = async id => {
  let response = await Wallet.findByPk(id);
  if (!response) {
    throw ApiError.notFound(errMsg.WALLET_NOT_FOUND);
  }

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
