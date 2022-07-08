const {fetchAll } = require('../models/modelAPI.js')

exports.getAll = (req, res, next) => {

  fetchAll().then((obj) => {
    console.log("hi")
    res.status(200).send({api : JSON.parse(obj)});
  })
};
