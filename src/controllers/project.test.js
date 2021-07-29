const { post, get, postTransacton, postViewer, postViewerVote } = require("./project");

const projectsm = require("../models/__mocks__/project");
const projectsbch = require("../services/__mocks__/blockchain");
const { ApiError } = require("../errors/ApiError");
const messages = require("../errors/messages");

jest.mock("../models/project");
jest.mock("../models/wallet");
jest.mock("../services/blockchain");


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test("/getOneProject successful response", async () => {
  const req = {
    params: {
      projectid: "10",
    },
  };
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...bchproject,
        ...projectsmod,
      }
    },
  };

  const res = mockResponse();

  await get(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test("/getOneProject unsuccessful response, not found", async () => {
  const req = {
    params: {
      projectid: "20",
    },
  };

  try {
    await get(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(404);
  }
});

test("/getOneProject unsuccessful response, bad formatted", async () => {
  const req = {
    params: {
      id: "10",
    },
  };

  try {
    await get(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(404);
  }
});

test("/createProject successful response", async () => {
  const req = {
    body: {
      ownerid: "testUser",
      projectid: "20",
      stages: [0.02, 0.01, 0.03]
    },
  };

  const resObj = {
    data: {
      status: "success",
      data: {
        currentStage: 0,
        missingAmount: 0.06,
        ownerid: "testUser",
        projectid: "20",
        smcid: "20",
        state: "on_review"
      },
    },
  };

  const res = mockResponse();

  await post(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});


test("/postViewer successfull response", async () => {
  const req = {
    params: {
      projectid: "10",
    },
    body: {
      ownerid: "seerWall1"
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...bchproject,
        ...projectsmod,
        state: 'on_review',
      }
    },
  };

  await postViewer(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining(resObj.data));
});

test("/postViewer successfull response", async () => {
  const req = {
    params: {
      projectid: "10",
    },
    body: {
      ownerid: "seerWall2"
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...bchproject,
        ...projectsmod,
        state: 'on_review',
      }
    },
  };

  await postViewer(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining(resObj.data));
});

test("/postViewer successfull response", async () => {
  const req = {
    params: {
      projectid: "10",
    },
    body: {
      ownerid: "seerWall3"
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...bchproject,
        ...projectsmod,
        state: 'funding',
      }
    },
  };

  await postViewer(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining(resObj.data));
});

test("/createTransaction successfull response, partial fund", async () => {
  const req = {
    params: {
      projectid: "10",
    },
    body: {
      ownerid: "testUser",
      amount: 1
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...projectsmod,
        ...bchproject,
        state: "funding",
        missingAmount: bchproject.missingAmount - req.body.amount,
        amount: req.body.amount,
      }
    },
  };
  await postTransacton(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test("/createTransaction successfull response, full fund", async () => {
  const req = {
    params: {
      projectid: "10",
    },
    body: {
      ownerid: "testUser",
      amount: 1
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...projectsmod,
        ...bchproject,
        state: 'in_progress',
        missingAmount: 0,
        amount: req.body.amount,
      }
    },
  };

  await postTransacton(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});



test("/createProject unsuccessful response, already created", async () => {
  const req = {
    body: {
      ownerid: "testUser",
      projectid: "10",
      stages: [0.02, 0.01, 0.03]
    },
  };

  try {
    await post(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
    expect(err.message).toEqual("Project already in smart-contract");
  }
});

test("/createProject unsuccessful response, bad formatted", async () => {
  const req = {
    body: {
      id: "testUser",
    },
  };

  try {
    await post(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
  }
});

test("/createTransaction unsuccessful response, bad formatted", async () => {
  const req = {
    body: {
      ownerid: "testUser",
    },
  };

  try {
    await postTransacton(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
  }
});

test("/createTransaction unsuccessful response, project not found", async () => {
  const req = {
    params: {
      projectid: 1,
    },
    body: {
      ownerid: "testUser",
      amount: 4
    },
  };

  try {
    await postTransacton(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
    expect(err.message).toEqual(messages.PROJECT_NOT_IN_SC);
  }
});


test("/createTransaction unsuccessful response, project not in funding state", async () => {
  const req = {
    params: {
      projectid: "11",
    },
    body: {
      ownerid: "testUser",
      amount: 4
    },
  };

  try {
    await postTransacton(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
    expect(err.message).toEqual(messages.PROJECT_IN_WRONG_STATE);
  }
});

test("/postVote successfull response", async () => {
  const req = {
    params: {
      viewerid: "seerWall3",
      projectid: "10",
    },
    body: {
      completedStage: 1
    },
  };
  const res = mockResponse();
  const bchproject = projectsbch.projects.find(obj => req.params.projectid === obj.smcid);
  const projectsmod = projectsm.projects.find(obj => req.params.projectid === obj.projectid);
  const resObj = {
    data: {
      status: "success",
      data: {
        ...bchproject,
        ...projectsmod,
        state: 'in_progress',
        missingAmount: 0,
      }
    },
  };

  await postViewerVote(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining(resObj.data));
});