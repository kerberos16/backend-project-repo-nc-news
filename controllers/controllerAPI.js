const {fetchAll } = require('../models/modelAPI.js')

exports.getAll = (req, res, next) => {

  fetchAll().then((obj) => {
    res.status(200).send({api : JSON.parse(obj)});
  })
};
