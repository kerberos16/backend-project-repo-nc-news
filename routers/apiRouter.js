const apiRouter = require('express').Router();

const {handle405s} = require("../errors/errorHandlers")

const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const app = require('../app');


apiRouter.get('/', (req, res, next) => {
    res.status(200).send({msg : availableEnpoints});
  });

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);


module.exports = apiRouter;

