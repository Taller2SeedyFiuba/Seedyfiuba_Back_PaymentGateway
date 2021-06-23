const { Wallet, sequelize } = require("../database");

const ethers = require("ethers");
const config = require("../config");
const { ApiError } = require("../errors/ApiError");

const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);

const getDeployerWallet = () => {
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = async payload => {
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);

  return await Wallet.create({
    ownerid: payload.ownerid,
    address: wallet.address,
    privatekey: wallet.privateKey,
  });
};

const getWallet = async id => {
  const response = await Wallet.findByPk(id);
  if (!response) return undefined;

  let balanceInWeis;

  try {
    console.log(response.privatekey);
    const walletInstance = new ethers.Wallet(response.privatekey).connect(provider);
    balanceInWeis = await walletInstance.getBalance();
  } catch (err) {
    throw ApiError.externalServiceError("Kovan request error");
  }

  return {
    ...response.dataValues,
    balance: ethers.utils.formatUnits(balanceInWeis),
  };
};

const getStatus = async () => {
  return sequelize.authenticate();
};

module.exports = {
  createWallet,
  getDeployerWallet,
  getWallet,
  getStatus,
};
