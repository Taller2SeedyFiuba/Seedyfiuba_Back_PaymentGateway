const { Wallet, sequelize } = require("../database");
const { ApiError } = require("../errors/ApiError");

const bch = require("../services/blockchain");

const createWallet = async payload => {
  // This may break in some environments, keep an eye on it
  const response = await Wallet.findByPk(payload.ownerid);
  if (response) throw ApiError.badRequest("User already has a wallet");

  let wallet = 0;
  let found = true;
  let contador = 0; //DEBUG
  console.log('CREANDO BILLETERA')
  while(found){
    console.log(`ITERACION ${contador}`)
    contador += 1;
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
    throw ApiError.notFound("Wallet not found");
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
