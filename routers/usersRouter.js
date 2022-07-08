const usersRouter = require("express").Router();
const { handle405s } = require("../errors/errorHandlers");

const {
    getUsers,
    getUserByUsername
} = require("../controllers/controllerUsers");

usersRouter
  .route("/")
  .get(getUsers)
  .all(handle405s);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405s);

module.exports = usersRouter;