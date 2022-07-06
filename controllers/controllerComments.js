const { user } = require('pg/lib/defaults');
const {insertComment} = require('../models/modelComments')

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const username = req.body.username
    const body = req.body.body
    
    if(
        !req.body.hasOwnProperty("username") ||
        !req.body.hasOwnProperty("body") ||
        Object.keys(req.body).length !==2
    ) { 
        return next({
            status: 400,
            msg: "Bad request: Invalid input parameters"
        })
    } else { 
        insertComment(username, article_id, body).then((comment) => {
        res.status(201).send({comment})
        }).catch((err) => {
            next(err)
        })
    }

}

