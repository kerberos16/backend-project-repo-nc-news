const {fetchArticlesById, updateArticle, fetchArticles, fetchComments, addArticle} = require('../models/modelArticles')

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticle(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query;
    fetchArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params
    fetchComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }) .catch((err) => {
        next(err)
    })
}

exports.postArticle = (req,res,next) => {
    const newArticle = req.body
    addArticle(newArticle).then((article) => {
        res.status(201).send({article})
    }).catch((err) => {
        next(err)
    })
}