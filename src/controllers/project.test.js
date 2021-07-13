const { post, get } = require("./project");

const { testProj } = require("../models/__mocks__/project");
const { testProjBch } = require("../services/__mocks__/blockchain");
const { ApiError } = require("../errors/ApiError");

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

  const resObj = {
    data: {
      status: "success",
      data: {
        ...testProj,
        ...testProjBch,
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
