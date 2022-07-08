const express = require("express")
const app = express();

const cors = require("cors")

const {getAll} = require("./controllers/controllerAPI")
app.get("/api", getAll)

const apiRouter = require("./routers/apiRouter")

const {
handle405s,
handleCustomErrors,
handlePSQLErrors, 
handleServerErrors} = require("./errors/errorHandlers")

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.use(handle405s)
app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

app.all("/*", (req,res,next) => {
    res.status(404).send({msg: "Invalid Path"})
})
module.exports = app