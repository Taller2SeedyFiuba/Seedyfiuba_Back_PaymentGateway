const { Project, sequelize } = require("../database");
const BigNumber = require("bignumber.js");

const { getDeployerWallet, getWallet } = require("./wallet");

const ethers = require("ethers");
const config = require("../config");
const { ApiError } = require("../errors/ApiError");

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const getProject = async id => {
  const response = await Project.findByPk(id);
  if (!response) return undefined;

  return {
    ...response.dataValues,
  };
};

const getContract = async () => {
  let contractAddress = await config.contractAddress();
  let contractAbi = await config.contractAbi();

  return new ethers.Contract(contractAddress, contractAbi, getDeployerWallet());
};

const createProject = async (payload) => {
  const ownerWallet = await getWallet(payload.ownerid);

  if (!ownerWallet) throw ApiError.badRequest("User doesn't own a wallet");
  console.log(ownerWallet);
  const seedyfiubaSC = await getContract();

  const tx = await seedyfiubaSC.createProject(
    payload.stages.map(toWei), ownerWallet.address);

  const receipt = await tx.wait(1);

  console.log("Transaction mined");
  const firstEvent = receipt && receipt.events && receipt.events[0];
  console.log(firstEvent);
  if (firstEvent && firstEvent.event == "ProjectCreated") {
    const projectId = firstEvent.args.projectId.toNumber();

    const project = await Project.create({
      ownerid: payload.ownerid,
      projectid: payload.projectid,
      smcid: projectId
    });

    return {
      ... project,
      state: 'on_review'
    }
  } else {
    throw new ApiError.externalServiceError("Project couldn't be mined");
  }
};

module.exports = {
  getProject,
  createProject,
};
