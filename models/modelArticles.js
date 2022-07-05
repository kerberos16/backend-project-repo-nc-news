const connection = require("../db/connection")

exports.fetchArticlesById = (article_id) => {
    return connection
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
      FROM articles 
      LEFT JOIN comments USING (article_id) WHERE articles.article_id = $1 GROUP BY articles.article_id`, [article_id])
    .then((article) => {
        if (article.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Article not found.",
            });
          } else return article.rows[0];
    })
}

 exports.updateArticle = (article_id, inc_votes) => {
    if (!inc_votes)
      return Promise.reject({ status: 400, msg: "Bad request: Missing input." });
    return connection
    .query('UPDATE articles SET votes = $1 WHERE article_id =$2 RETURNING*', [inc_votes,article_id]).then(({rows}) => {
        if(rows.length === 0) {
          return Promise.reject({
            status:404,
            msg: "Bad Request: Invalid input data"
          })
        } else return rows[0]
    })
  };