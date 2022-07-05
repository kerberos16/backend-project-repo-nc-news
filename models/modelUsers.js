const connection = require("../db/connection")

exports.fetchUsers = () => {
    
    return connection
    .query ('SELECT * FROM users;').then(({rows}) => {
        console.log(rows)
        return rows

    })
}