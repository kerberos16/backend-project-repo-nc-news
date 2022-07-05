const express = require("express")

const { getTopics } = require("./controllers/controllerTopic.js")
const { getArticlesById} = require("./controllers/controllerArticles.js")

const {handlePSQLErrors, handleCustomErrors, handleServerErrors} = require("./errors/errorHandlers")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticlesById)

app.all("/*", (req,res,next) => {
    res.status(404).send({msg: "Invalid Path"})
})

app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app