const articlesRouter = require("express").Router();
const { handle405s } = require("../errors/errorHandlers");
const {
    getArticlesById,
    patchArticle,
    getArticles,
    getComments,
    postArticle,
} = require("../controllers/controllerArticles");

const { postComment } = require("../controllers/controllerComments")

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(patchArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(handle405s);

module.exports = articlesRouter;