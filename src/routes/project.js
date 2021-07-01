const router = require("express").Router();
const pc = require("../controllers/project");
const { hocError } = require("../errors/handler");

function getProjectsRouter() {
  router.post("/", hocError(pc.post));

  router.get("/:projectid", hocError(pc.get));

  router.post("/:projectid/transactions", hocError(pc.postTransacton));

  return router;
}

module.exports = { getProjectsRouter };
