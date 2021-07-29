const { ApiError } = require("../../errors/ApiError");

const testWall = {
  ownerid: "testUser",
  address: "0x9386C488A765BE858ca89219F4E837A0437CEfA9",
  privatekey: 'p1',
  creationdate: "2021-06-23",
  balance: "10.0",
};

const seerWall1 = {
  ownerid: "seerWall1",
  address: "0x9386C488A765BE858ca89219F4E837A0437CEfA1",
  privatekey: 'p2',
  creationdate: "2021-06-23",
  balance: "10.0",
};
const seerWall2 = {
  ownerid: "seerWall2",
  address: "0x9386C488A765BE858ca89219F4E837A0437CEfA2",
  privatekey: 'p3',
  creationdate: "2021-06-23",
  balance: "10.0",
};
const seerWall3 = {
  ownerid: "seerWall3",
  address: "0x9386C488A765BE858ca89219F4E837A0437CEfA3",
  privatekey: 'p4',
  creationdate: "2021-06-23",
  balance: "10.0",
};

const wallets = [testWall, seerWall1, seerWall2, seerWall3];

const createWallet = async user => {
  if (user.ownerid === "testUser") {
    throw ApiError.badRequest("User already has a wallet");
  }

  const newWall = {
    ownerid: user.ownerid,
    address: "0x9386C488A765BE858ca89219F4E837A0437CEfA9",
    creationdate: "2020-09-09",
    balance: "0.0",
  };
  wallets.push(newWall);
  return newWall
};

const getWallet = async id => {
  const wallet = wallets.find(wall => wall.ownerid === id);
  if (wallet) return wallet;
  throw ApiError.notFound("Wallet not found");
};

module.exports = { createWallet, getWallet, testWall };
