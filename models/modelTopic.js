const connection = require("../db/connection")

exports.fetchTopics = () => {
    return connection
    .query ('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}

exports.addTopic = (newTopic) => {
    return connection
    .query(`
    INSERT INTO topics (description, slug) 
    VALUES ($1, $2)
    RETURNING*;
    `, [newTopic.description, newTopic.slug])
    .then(({rows}) => {
        return rows[0]
    })
}