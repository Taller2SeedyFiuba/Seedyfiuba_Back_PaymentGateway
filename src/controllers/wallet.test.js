const { post, get } = require("./wallet");

const { testWall } = require("../models/__mocks__/wallet");
const { ApiError } = require("../errors/ApiError");

jest.mock("../models/wallet");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test("/getOneWallet successful response", async () => {
  const req = {
    params: {
      ownerid: "testUser",
    },
  };

  const resObj = {
    data: {
      status: "success",
      data: testWall,
    },
  };

  const res = mockResponse();

  await get(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(resObj.data);
});

test("/getOneWallet unsuccessful response, not found", async () => {
  const req = {
    params: {
      ownerid: "id",
    },
  };

  try {
    await get(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(404);
  }
});

test("/getOneWallet unsuccessful response, bad formatted", async () => {
  const req = {
    params: {
      id: "id",
    },
  };

  try {
    await get(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(404);
  }
});

test("/createWallet successful response", async () => {
  const req = {
    body: {
      ownerid: "1",
    },
  };

  const resObj = {
    data: {
      status: "success",
      data: {
        ownerid: "1",
        address: "0x9386C488A765BE858ca89219F4E837A0437CEfA9",
        creationdate: "2020-09-09",
        balance: "0.0",
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
      ownerid: "testUser",
    },
  };

  try {
    await post(req);
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toEqual(400);
    expect(err.message).toEqual("User already has a wallet");
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
