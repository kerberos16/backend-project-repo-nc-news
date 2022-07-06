const connection = require("../db/connection")


exports.checkArticleExists = (article_id) => {
    return connection
    .query(`
    SELECT articles.*
    FROM articles
    WHERE articles.article_id = $1 
    LIMIT 1`, [article_id]).then((result) => {
        if(!result.rowCount){
            return Promise.reject({status:404, msg: "Article Id does not exist."})
        } else {
            return result.rows
        }
    })
}