const { post, get } = require("./project");

const { testProj } = require("../models/__mocks__/project");
const { ApiError } = require("../errors/ApiError");

jest.mock("../models/project");

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
      data: testProj,
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
      ownerid: "1",
      projectid: "20",
      stages: [20, 10, 30]
    },
  };

  const resObj = {
    data: {
      status: "success",
      data: {
        ownerid: "1",
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

test("/createWallet unsuccessful response, already created", async () => {
  const req = {
    body: {
      ownerid: "1",
      projectid: testProj.projectid,
      stages: [20, 10, 30]
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

test("/createWallet unsuccessful response, bad formatted", async () => {
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
