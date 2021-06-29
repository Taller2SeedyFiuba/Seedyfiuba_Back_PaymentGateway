const testProj = {
  ownerid: "testUser",
  projectid: "10",
  creationdate: "2021-06-23",
  balance: "0.001",
};

const createProject = async project => {
  return {
    ownerid: project.ownerid,
    projectid: project.projectid,
    smcid: project.projectid,
    state: "on_review"
  };
};

const getProject = async projectid => {
  if (projectid === "10") return testProj;
};

module.exports = { createProject, getProject, testProj };
