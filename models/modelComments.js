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


exports.removeComment =  (comment_id) => {
    return connection
    .query ('DELETE FROM comments WHERE comment_id =$1;', [comment_id])
    .then((rows) => {
        if(rows.rowCount === 0) {
            return Promise.reject({
              status:404,
              msg: "Page not found: Comment does not exist"
            })
    } else return rows
    
})};

