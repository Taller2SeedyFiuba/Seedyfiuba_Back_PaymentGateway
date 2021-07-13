const testProjBch = {
  smcid: '10',
  currentStage: 0,
  state: 'on_review',
  missingAmount: '0.006'
}

const projects = [testProjBch];

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

module.exports = {
  createProject,
  getProject,
  testProjBch,
}