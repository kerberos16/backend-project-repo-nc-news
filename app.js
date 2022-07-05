const express = require("express")

const { getTopics } = require("./controllers/controllerTopic.js")
const { getArticlesById, patchArticle} = require("./controllers/controllerArticles.js")
const { getUsers } = require("./controllers/controllerUsers")

const {handlePSQLErrors, handleCustomErrors, handleServerErrors} = require("./errors/errorHandlers")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", patchArticle)
app.get('/api/users', getUsers)

app.all("/*", (req,res,next) => {
    res.status(404).send({msg: "Invalid Path"})
})

app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app