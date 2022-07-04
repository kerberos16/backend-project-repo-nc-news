const express = require("express")

const { getTopics} = require("./controllers/controller.js")
const {handlePSQLErrors, handleCustomErrors, handleServerErrors} = require("./errors/errorHandlers")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics)

app.all("/*", (req,res,next) => {
    res.status(404).send({msg: "Invalid Path"})
})

app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app