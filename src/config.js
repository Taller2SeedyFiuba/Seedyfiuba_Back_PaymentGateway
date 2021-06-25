require("dotenv").config();
const network = "kovan";

const fetch = require('node-fetch');

let artifactUrl = process.env.DEPLOY_ARTIFACT_URL;

let settings = { method: "Get" };

let deployArtifact;

fetch(artifactUrl, settings)
.then(res => res.json())
.then((deployArtifactWeb) => {
  deployArtifact = deployArtifactWeb;
})
.catch((err) => {
  console.log(err);
  console.error("No smart-contract available");
})

const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;

console.log(deployerMnemonic);
module.exports = {
  contractAddress: () => deployArtifact.address,
  contractAbi: () => deployArtifact.abi,
  deployerMnemonic,
  infuraApiKey,
  network,
};
