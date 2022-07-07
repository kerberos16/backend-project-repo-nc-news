  exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "23503") {
      res.status(404).send({ msg: "Path not found!" });
    }
    else if (err.code === "23502" || err.code === "42703" || err.code === "22P02") {
      res.status(400).send({ msg: "Bad Request!" });
    } else{
      next(err)
    }
    ;
  };
  exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status){
      res.status(err.status).send({msg: err.msg})
    }
  }

  exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error!"})
  }
