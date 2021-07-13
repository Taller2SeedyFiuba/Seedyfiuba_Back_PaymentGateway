const router = require("express").Router();
const pc = require("../controllers/project");

const { hocError } = require("../errors/handler");

function getProjectsRouter() {
  router.post("/", hocError(pc.post));

  router.get("/:projectid", hocError(pc.get));

  router.post("/:projectid/transactions", hocError(pc.postTransacton));

  router.post("/:projectid/viewers", hocError(pc.postViewer));

  router.post("/:projectid/viewers/:viewerid/votes", hocError(pc.postViewerVote));

  return router;
}

module.exports = { getProjectsRouter };
