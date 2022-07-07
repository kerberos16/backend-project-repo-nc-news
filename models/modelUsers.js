const connection = require("../db/connection")

exports.fetchUsers = () => {
    
    return connection
    .query ('SELECT * FROM users;').then(({rows}) => {
        return rows

    })
}