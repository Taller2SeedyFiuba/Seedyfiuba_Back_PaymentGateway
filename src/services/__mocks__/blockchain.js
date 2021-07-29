
const errMsg = require('../../errors/messages');
const { ApiError } = require("../../errors/ApiError");

const testProjBch = {
  smcid: '10',
  currentStage: 0,
  state: 'on_review',
  missingAmount: '2'
}

const fundProjBch = {
  smcid: '11',
  currentStage: 0,
  state: 'on_review',
  missingAmount: '2'
}

const projects = [testProjBch, fundProjBch];

const viewers = {};

const votes = {};

const getProject = async (smcid) => {
  const project = projects.find(obj => obj.smcid === smcid);
  if (!project) throw ApiError.externalServiceError("Project couldn't be found");
  return project;
}

const createProject = (ownerAddress, stages) => {

  const createdProject = {
    smcid: "20",
    currentStage: 0,
    state: 'on_review',
    missingAmount: stages.reduce((accum, val) => accum + val, 0)
  }
  projects.push(createdProject);
  return createdProject.smcid;
}

const transferToProject =  async (smcid, privatekey, amount) => {
  const i = projects.findIndex(obj => obj.smcid === smcid);
  if (projects[i].missingAmount <= amount) {
    let originMissingAmount = projects[i].missingAmount;
    projects[i].missingAmount = 0;
    projects[i].state = 'in_progress';
    console.log(originMissingAmount);
    return originMissingAmount;
  } else {
    projects[i].missingAmount = projects[i].missingAmount - amount;
    return amount;
  }
}

const addViwerToProject = async (smcid, privatekeyViewer) => {
  const i = projects.findIndex(obj => obj.smcid === smcid);
  const project = projects[i];
  if (project.state !== 'on_review') throw ApiError.dependencyError(errMsg.VIEWER_ERROR_ADDING);

  viewers[project.smcid] = viewers[project.smcid] || [];
  const alreadyViewing = viewers[project.smcid].find(el => el === privatekeyViewer);
  if(alreadyViewing) throw ApiError.dependencyError(errMsg.VIEWER_ERROR_ADDING);

  viewers[project.smcid].push(privatekeyViewer);
  if (viewers[project.smcid].length === 3) {
    projects[i].state = 'funding';
    return 'funding';
  }
  return 'on_review';
}

const voteProjectStage = async (smcid, privatekeyViewer, stageNumber) => {
  const i = projects.findIndex(obj => obj.smcid === smcid);
  const project = projects[i];
  if (project.state !== 'in_progress') throw ApiError.dependencyError(errMsg.VIEWER_ERROR_VOTING);

  viewers[project.smcid] = viewers[project.smcid] || [];
  const alreadyViewing = viewers[project.smcid].find(el => el === privatekeyViewer);
  if(!alreadyViewing) throw ApiError.dependencyError(errMsg.VIEWER_ERROR_VOTING);

  votes[project.smcid] = votes[project.smcid] || {};
  votes[project.smcid][stageNumber] = votes[project.smcid][stageNumber] || [];

  const alreadyVoted = votes[project.smcid][stageNumber].find(el => el === privatekeyViewer);
  if(alreadyVoted) throw ApiError.dependencyError(errMsg.VIEWER_ERROR_VOTING);
  votes[project.smcid][stageNumber].push(privatekeyViewer);

  if (votes[project.smcid][stageNumber].length === 3) {
    projects[i].currentStage = stageNumber++;
  }
  
  return 'in_progess';
}

module.exports = {
  projects,
  createProject,
  getProject,
  testProjBch,
  transferToProject,
  addViwerToProject,
  voteProjectStage,
}