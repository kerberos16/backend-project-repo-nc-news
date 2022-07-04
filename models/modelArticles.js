const connection = require("../db/connection")

exports.fetchArticlesById = (article_id) => {
    return connection
    .query('SELECT * FROM articles WHERE article_id =$1;', [article_id])
    .then((result) => {
        return result
    })
}