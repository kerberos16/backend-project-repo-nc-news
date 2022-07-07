const express = require("express")

const { getTopics } = require("./controllers/controllerTopic.js")
const { getArticlesById, patchArticle, getArticles, getComments} = require("./controllers/controllerArticles.js")
const { getUsers } = require("./controllers/controllerUsers")
const { postComment, deleteComment } = require("./controllers/controllerComments")
const { getAll } = require("./controllers/controllerAPI.js")


const {handlePSQLErrors, handleCustomErrors, handleServerErrors, handle405s} = require("./errors/errorHandlers")
const { restart } = require("nodemon")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", patchArticle)
app.get('/api/users', getUsers)
app.get('/api/articles' , getArticles)
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)
app.delete('/api/comments/:comment_id', deleteComment)
app.get('/api', getAll)



app.all("/*", (req,res,next) => {
    res.status(404).send({msg: "Invalid Path"})
})

app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app