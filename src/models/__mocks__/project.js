const testProj = {
  ownerid: "testUser",
  smcid: "10",
  projectid: "10",
  creationdate: "2021-06-23",
};

const fundProj = {
  ownerid: "testUser",
  smcid: "11",
  projectid: "11",
  creationdate: "2021-06-23",
};

const projects = [testProj, fundProj];

const createProject = async project => {
  return {
    ownerid: project.ownerid,
    projectid: project.projectid,
    smcid: project.projectid,
    state: "on_review"
  };
};

const getProject = async projectid => {
  return projects.find(obj => obj.projectid === projectid)
};

module.exports = { createProject, getProject, testProj, projects };
