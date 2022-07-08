const topicsRouter = require("express").Router();
const { handle405s } = require("../errors/errorHandlers");
const { getTopics } = require("../controllers/controllerTopic");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405s);

module.exports = topicsRouter;