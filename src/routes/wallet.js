const router = require("express").Router();
const wc = require("../controllers/wallet");
const { hocError } = require("../errors/handler");

function getWalletsRouter() {
  router.post("/", hocError(wc.post));

  router.get("/:ownerid", hocError(wc.get));

  return router;
}

module.exports = { getWalletsRouter };
