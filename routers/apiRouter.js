const apiRouter = require('express').Router();

const {handle405s} = require("../errors/errorHandlers")

const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");

apiRouter.get('/', (req, res, next) => {
    res.status(200).send({msg : availableEnpoints});
  }).all(handle405s);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;

