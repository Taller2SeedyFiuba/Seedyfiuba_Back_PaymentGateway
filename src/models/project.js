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
  const project = await Project.create({
    ownerid: payload.ownerid,
    projectid: payload.projectid,
    smcid: payload.smcid,
  });

  return {
    ... project.dataValues,
  }
};

module.exports = {
  getProject,
  createProject,
};
