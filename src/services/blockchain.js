

const ethers = require("ethers");
const config = require("../config");
const BigNumber = require("bignumber.js");

const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);

const _getWalletFromNetwork = (privatekey) => {
  try {
    const walletInstance = new ethers.Wallet(privatekey).connect(provider);
    return walletInstance;
  } catch (err) {
    throw ApiError.externalServiceError("Kovan request error");
  }
}

const getWalletBalance = async (privatekey) => {
  const balanceInWeis = await _getWalletFromNetwork(privatekey).getBalance();
  return weisToEthers(balanceInWeis);
}

const weisToEthers = ethers.utils.formatUnits;

const ethersToWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const getDeployerWallet = () => {
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const getContract = async () => {
  return new ethers.Contract(config.contractAddress(), config.contractAbi(), getDeployerWallet());
};

const createProject = async (payload) => {
  // console.log(ownerWallet);
  const seedyfiubaSC = await getContract(getDeployerWallet());

  const tx = await seedyfiubaSC.createProject(
    payload.stages.map(ethersToWei), payload.ownerAddress);

  const receipt = await tx.wait(1);

  const firstEvent = receipt && receipt.events && receipt.events[0];

  if (firstEvent && firstEvent.event == "ProjectCreated") {
    const projectId = firstEvent.args.projectId.toNumber();
    return projectId;
  } else {
    throw ApiError.externalServiceError("Project couldn't be mined");
  }
}
const createWallet = () => {
  const wallet = ethers.Wallet.createRandom().connect(provider);
  console.log("ACAAAA", wallet);
  return wallet;
};

module.exports = {
  getWalletBalance,
  createWallet,
  ethersToWei,
  weisToEthers,
  createProject,
}