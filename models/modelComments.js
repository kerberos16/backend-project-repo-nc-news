const connection = require("../db/connection")
const { commentData } = require("../db/data/test-data")

exports.insertComment = (username, article_id, body) => {
    return connection
    .query(`
    INSERT INTO comments (author, article_id, body) 
    VALUES ($1,$2,$3)
    RETURNING *;
    `, [username, article_id, body]).then(({rows}) => {
        return rows[0]
    })
}

