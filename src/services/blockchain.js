

const ethers = require("ethers");
const config = require("../config");
const BigNumber = require("bignumber.js");
const { ApiError } = require("../errors/ApiError");
const errMsg = require('../errors/messages');
const { logDebug, logError, logInfo } = require("../utils/log");

let provider;

if (process.env.SMC_ENV === 'testing') {
  logDebug("TEST PROVIDER");
  provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
} else {
  provider = new ethers.providers.InfuraProvider(process.env.BCH_PROVIDER, process.env.INFURA_API_KEY);
}

const PROJECT_STAGES = [ 'funding', 'canceled', 'in_progress', 'completed', 'on_review' ]

const _getWalletFromNetwork = (privatekey) => {
  try {
    const walletInstance = new ethers.Wallet(privatekey).connect(provider);
    return walletInstance;
  } catch (err) {
    throw ApiError.externalServiceError(errMsg.KOVAN_REQ_ERROR);
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

const gweiToWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(9);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};


const getDeployerWallet = () => {
  const deployerWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  return deployerWallet;
};

const createWallet = () => {
  if (process.env.SMC_ENV === 'testing') {
    return ethers.Wallet.fromMnemonic(config.deployerMnemonic, `m/44'/60'/0'/0/${Math.floor(Math.random() * 5000) + 1}`).connect(provider);
  }
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return wallet;
};

const getContract = async () => {
  const wallet = getDeployerWallet();

  return new ethers.Contract(config.contractAddress(), config.contractAbi(), wallet);
};

const getContractForUser = async (privatekey) => {
  const wallet = _getWalletFromNetwork(privatekey);
  return new ethers.Contract(config.contractAddress(), config.contractAbi(), wallet);
};

/** Expects:
 * {
 *  ownerAddress: <>
 *  stages: [0.01, 0.02 ..]
 * }
 * Returns: smcId
 */
const createProject = async (ownerAddress, stages) => {

  try{
    const seedyfiubaSC = await getContract();

    const tx = await seedyfiubaSC.createProject(
      stages.map(ethersToWei), ownerAddress, {
        gasLimit: 4000000,
      });

    const receipt = await tx.wait(1);

    const firstEvent = receipt && receipt.events && receipt.events[0];

    if (firstEvent && firstEvent.event == "ProjectCreated") {
      const smcid = firstEvent.args.projectId.toNumber();
      return smcid;
    }
  } catch (err) {
    logError(err);
    throw ApiError.externalServiceError(errMsg.PROJECT_ERROR_MINING);
  }
  throw ApiError.externalServiceError(errMsg.PROJECT_ERROR_MINING);
}

const getProject = async (smcid) => {
  try{
    const seedyfiubaSC = await getContract();
    const tx = await seedyfiubaSC.projects(smcid);
    logInfo(tx);
    return {
      smcid,
      currentStage: tx.currentStage.toString(),
      state: PROJECT_STAGES[tx.state],
      missingAmount: weisToEthers(tx.missingAmount)
    }
  } catch (err) {
    throw ApiError.externalServiceError(errMsg.PROJECT_NOT_FOUND);
  }
}

const transferToProject = async (smcid, privatekey, amount) => {
  try {

    const seedyfiubaSC = await getContractForUser(privatekey);

    logInfo(ethersToWei(amount));
    const tx = await seedyfiubaSC.fund(smcid, {
      gasLimit: 4000000,
      value: ethersToWei(amount),
    });

    const receipt = await tx.wait(1);
    const firstEvent = receipt && receipt.events && receipt.events[0];

    if (firstEvent && firstEvent.event == "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();

      const amount = weisToEthers(firstEvent.args.funds);
      logInfo("PROJECTFUNDED: ", projectId, amount);
      return amount;
    }
  } catch (err) {
    throw ApiError.externalServiceError(errMsg.PROJECT_ERROR_FUNDING);
  }
  throw ApiError.externalServiceError(errMsg.PROJECT_ERROR_FUNDING);
}

const addViwerToProject = async (smcid, privatekeyViewer) => {
  try {
    const seedyfiubaSC = await getContractForUser(privatekeyViewer);

    const tx = await seedyfiubaSC.addReviewer(smcid, {
      gasLimit: 4000000,
    });

    const receipt = await tx.wait(1);
    const firstEvent = receipt && receipt.events && receipt.events[0];

    if (firstEvent && firstEvent.event == "ReviwerAdded") {
      const secondEvent = receipt && receipt.events && receipt.events[1];
      if(secondEvent && secondEvent.event == "ProjectFunding") {
        return "funding";
      }
      return "on_review";
    }
  } catch (err) {
    throw ApiError.badRequest(`${errMsg.VIEWER_ERROR_ADDING}: ${err.error.message}`);
  }
  throw ApiError.externalServiceError(errMsg.VIEWER_ERROR_ADDING);
}

const voteProjectStage = async (smcid, privatekeyViewer, stageNumber) => {
  try {
    const seedyfiubaSC = await getContractForUser(privatekeyViewer);

    const tx = await seedyfiubaSC.setCompletedStage(smcid, stageNumber, {
      gasLimit: 4000000,
    });

    const receipt = await tx.wait(1);

    const thirdEvent = receipt && receipt.events && receipt.events[2];
    if(thirdEvent && thirdEvent.event == "ProjectFunding") {
      return "completed";
    }

    const secondEvent = receipt && receipt.events && receipt.events[1];
    if(secondEvent && secondEvent.event == "StageCompleted") {
      return "in_progress";
    }

    const firstEvent = receipt && receipt.events && receipt.events[0];
    if (firstEvent && firstEvent.event == "ReviewerVoted") {
      return "in_progress";
    }
  } catch (err) {
    logError(err);
    throw ApiError.externalServiceError(`${errMsg.VIEWER_ERROR_VOTING}: ${err.error.message}`);
  }
  throw ApiError.externalServiceError(errMsg.VIEWER_ERROR_VOTING);
}

module.exports = {
  getWalletBalance,
  createWallet,
  ethersToWei,
  weisToEthers,
  createProject,
  getProject,
  transferToProject,
  addViwerToProject,
  voteProjectStage,
}
