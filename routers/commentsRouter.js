const commentsRouter = require("express").Router();
const { handle405s } = require("../errors/errorHandlers");

const {
    patchComment,
    deleteComment
} = require("../controllers/controllerComments");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405s);

module.exports = commentsRouter;