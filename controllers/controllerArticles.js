const {fetchArticlesById} = require('../models/modelArticles')

exports.getArticlesById = (req, res, next) => {
    console.log("Hello")
    const article_id = req.params;
    fetchArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}