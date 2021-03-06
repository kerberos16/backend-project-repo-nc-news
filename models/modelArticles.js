const { rows } = require("pg/lib/defaults");
const connection = require("../db/connection")
const {checkArticleExists, checkTopicExists} = require("./checkIfExists")

exports.fetchArticlesById = (article_id) => {
    return connection
    .query(
      `SELECT articles.*, 
      COUNT(comments.comment_id)::INT AS comment_count 
      FROM articles 
      LEFT JOIN comments USING (article_id) 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id`, [article_id])
    .then((article) => {
        if (article.rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: "Article not found.",
            });
          } else return article.rows[0];
    })
}

 exports.updateArticle = (article_id, inc_votes) => {
    if (!inc_votes)
      return Promise.reject({ status: 400, msg: "Bad request: Missing input." });
    return connection
    .query('UPDATE articles SET votes = votes + $1 WHERE article_id =$2 RETURNING*', [inc_votes,article_id]).then(({rows}) => {
        if(rows.length === 0) {
          return Promise.reject({
            status:404,
            msg: "Bad Request: Invalid input data"
          })
        } else return rows[0]
    })
  };

  exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {

    const queryValues = []

    const validSorting = ["article_id","title","topic","author","body","created_at","votes","comment_count"]
    const validOrder = ["asc", "desc"]

    let queryString = `SELECT articles.*,
    COUNT (comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments USING (article_id) 
    `

    if(!validSorting.includes(sort_by)){
      return Promise.reject({status: 404, msg: "Bad Request: Invalid input data."})
    } else if (!validOrder.includes(order)) {
      return Promise.reject({ status: 404, msg: "Bad Request: Invalid input data." });
    } 

      if(topic){
        queryString += `WHERE topic = $1`
        queryValues.push(topic)
      } 
      queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`

    return connection
    .query(queryString, queryValues).then(({rows : articles}) => {
        if(articles.length === 0){
          return checkTopicExists(topic).then((result) => {
            if(!result){
              return Promise.reject({status: 404, msg: "Bad request: Invalid input topic"})
            }
          })
        }
        return articles
      })
  }

  exports.fetchComments = (article_id) => {
    return connection
    .query(
      `SELECT *
      FROM comments
      WHERE comments.article_id = $1 `, [article_id])
    .then((comment) => { 
      if (!comment.rows.length) {
        return checkArticleExists(article_id)
    }
    return comment.rows;
    })
  }

  exports.addArticle = (newArticle) => {
    if (
      typeof newArticle.title !== "string" ||
      typeof newArticle.topic !== "string" ||
      typeof newArticle.username !== "string" ||
      typeof newArticle.body !== "string"
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: Invalid input data"
      });
  }

  newArticle.author = newArticle.username
  delete newArticle.username

  return connection
  .query(`
  INSERT INTO articles (title, topic, author, body)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, 
  [newArticle.title, newArticle.topic, newArticle.author, newArticle.body]
  )
  .then(({rows}) => {
    return rows[0]

  })
}

exports.removeArticle = (article_id) => {
  return connection
  .query(`
  DELETE FROM articles
  WHERE article_id = $1;`, [article_id])
  .then((rows) => {
    if(rows.rowCount === 0) {
      return Promise.reject({
        status:404,
        msg: "Page not found: Article does not exist"
      })
    } else return rows
  })
}