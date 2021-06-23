const { getStatus } = require("../models/wallet");

async function getAPIStatus(req, res) {
  await getStatus();

  res.status(200).json({
    status: "success",
    data: null,
  });
}

module.exports = { getAPIStatus };
