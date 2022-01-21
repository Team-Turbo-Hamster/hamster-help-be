exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res) => {
  console.log(err);

  // This would be really, really bad to have running in production
  // but is quite handy in development
  if (process.env.NODE_ENV === "development") {
    console.log("PARAMS", req.params);
    console.log("QUERY", req.query);
    console.log("BODY", req.body);
    console.log("URL", req.url);
  }

  res.status(500).send({ msg: "Internal Server Error" });
};
