const topicsRouter = require("express").Router();
const { handle405s } = require("../errors/errorHandlers");
const { getTopics, postTopic } = require("../controllers/controllerTopic");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(handle405s);

module.exports = topicsRouter;