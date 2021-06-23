const testWall = {
  ownerid: "testUser",
  address: "0x9386C488A765BE858ca89219F4E837A0437CEfA9",
  creationdate: "2021-06-23",
  balance: "0.001",
};

const createWallet = async user => {
  return {
    ownerid: user.ownerid,
    address: "0x9386C488A765BE858ca89219F4E837A0437CEfA9",
    creationdate: "2020-09-09",
    balance: "0.0",
  };
};

const getWallet = async id => {
  if (id === "testUser") return testWall;
};

module.exports = { createWallet, getWallet, testWall };
