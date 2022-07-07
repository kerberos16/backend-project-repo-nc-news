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

exports.updateComment = (comment_id, inc_votes) => {
    if(!inc_votes){
        return Promise.reject({status: 400, msg: "Bad request: Missing input." })
    }
    return connection
    .query('UPDATE comments SET votes = votes + $1 WHERE comment_id =$2 RETURNING*', [inc_votes, comment_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Bad Request: Invalid input data"
            })
        } else return rows[0]
    })
}
