const connection = require("../db/connection")

exports.fetchUsers = () => {
    
    return connection
    .query ('SELECT * FROM users;').then(({rows}) => {
        return rows

    })
}

exports.fetchUserByUsername = (username) => {
   
    return connection
    .query(`
    SELECT users.*
    FROM users
    WHERE users.username = $1`, [username])
    .then((user) => {
        if(user.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: "User not found!"
            })
        } else return user.rows[0]
    })
}