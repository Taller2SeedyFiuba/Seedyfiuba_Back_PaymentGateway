require("dotenv").config();
const network = "kovan";

const ethers = require("ethers");
const fetch = require("node-fetch");
const errMsg = require('./errors/messages');

let artifactUrl = process.env.DEPLOY_ARTIFACT_URL;

let settings = { method: "Get" };

let deployArtifact;

fetch(artifactUrl, settings)
  .then(res => res.json())
  .then(deployArtifactWeb => {
    deployArtifact = deployArtifactWeb;
  })
  .catch(err => {
    console.log(`Error: ` + err)
    throw new Error(errMsg.NO_SMART_CONTRACT);
  });

const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;

module.exports = {
  contractAddress: () => {
    if (!deployArtifact.address) throw new Error(errMsg.NO_SMART_CONTRACT);
    return deployArtifact.address;
  },
  contractAbi: () => {
    if (!deployArtifact.abi) throw new Error(errMsg.NO_SMART_CONTRACT);
    return deployArtifact.abi;
  },
  deployerMnemonic,
  infuraApiKey,
  network,
  log: {
    error: process.env.LOG_ERROR == undefined || process.env.LOG_ERROR.toLowerCase() == 'true',
    warn: process.env.LOG_WARN == undefined || process.env.LOG_WARN.toLowerCase() == 'true',
    info: process.env.LOG_INFO == undefined || process.env.LOG_INFO.toLowerCase() == 'true',
    debug: process.env.LOG_DEBUG == undefined || process.env.LOG_DEBUG.toLowerCase() == 'true',
  }
};
