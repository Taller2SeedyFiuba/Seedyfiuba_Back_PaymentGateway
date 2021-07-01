const { Project, sequelize } = require("../database");


const { getWallet } = require("./wallet");
const bch = require("../services/blockchain");
const { ApiError } = require("../errors/ApiError");

const getProject = async id => {
  const response = await Project.findByPk(id);
  if (!response) return undefined;

  return {
    ...response.dataValues,
  };
};

const createProject = async (payload) => {
  const ownerWallet = await getWallet(payload.ownerid);
  const smcid = await bch.createProject({
    ... payload,
    ownerAddress: ownerWallet.address,
  });
  console.log(ownerWallet.address);

  const project = await Project.create({
    ownerid: payload.ownerid,
    projectid: payload.projectid,
    smcid,
  });

  return {
    ... project.dataValues,
    state: 'on_review'
  }
};

module.exports = {
  getProject,
  createProject,
};
