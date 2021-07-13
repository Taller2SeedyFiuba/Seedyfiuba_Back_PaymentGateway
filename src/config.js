require("dotenv").config();
const network = "kovan";

const ethers = require("ethers");
const fetch = require("node-fetch");

let artifactUrl = process.env.DEPLOY_ARTIFACT_URL;

let settings = { method: "Get" };

let deployArtifact;

fetch(artifactUrl, settings)
  .then(res => res.json())
  .then(deployArtifactWeb => {
    deployArtifact = deployArtifactWeb;
  })
  .catch(err => {
    console.log(err);
    throw new Error("No smart-contract available");
  });

const deployerMnemonic = process.env.NODE_ENV !== 'testing' ? process.env.MNEMONIC : 'test test test test test test test test test test test junk';
const infuraApiKey = process.env.INFURA_API_KEY;


console.log(deployerMnemonic);
module.exports = {
  contractAddress: () => {
    if (!deployArtifact.address) throw new Error("No smart-contract available");
    return deployArtifact.address;
  },
  contractAbi: () => {
    if (!deployArtifact.abi) throw new Error("No smart-contract available");
    return deployArtifact.abi;
  },
  deployerMnemonic,
  infuraApiKey,
  network,
};
