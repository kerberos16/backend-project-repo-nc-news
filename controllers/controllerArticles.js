const {fetchArticlesById, updateArticle, fetchArticles} = require('../models/modelArticles')

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
    const { sort_by, order } = req.query;
    fetchArticles(sort_by, order).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

