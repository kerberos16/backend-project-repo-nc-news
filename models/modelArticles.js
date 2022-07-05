const connection = require("../db/connection")

exports.fetchArticlesById = (article_id) => {
    return connection
    .query('SELECT * FROM articles WHERE article_id =$1;', [article_id])
    .then((article) => {
        if (article.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Article not found.",
            });
          } else return article.rows[0];
    })


}