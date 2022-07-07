const { restart } = require('nodemon');
const { user } = require('pg/lib/defaults');
const {insertComment, removeComment, updateComment} = require('../models/modelComments')

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


exports.deleteComment = (req,res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then(() => {
    res.status(204).send('Comment deleted!')})
    .catch((err) => {
        next(err)
    })
  };


exports.patchComment = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    updateComment(comment_id, inc_votes).then((comment) => {
        res.status(200).send({comment})
    }).catch((err) => {
        next(err)
    })
}


