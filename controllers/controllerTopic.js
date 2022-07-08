const {fetchTopics, addTopic} = require('../models/modelTopic')

exports.getTopics = (req,res,next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
}

exports.postTopic = (req, res, next) => {
    const newTopic = req.body

    if( !newTopic.hasOwnProperty("username") ||
        !newTopic.hasOwnProperty("body")
    ) {     return next({
            status: 400,
            msg: "Bad request: Invalid input parameters"
        })
    } else {
        addTopic(newTopic).then((topic) => {
            console.log(topic)
            res.status(201).send({topic})
        }).catch((err) => {
            next(err)
        })
    }
}