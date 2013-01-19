var logger = require("../lib/logger.js");

function handleError(err, req, res, next){
  logger.send(err.stack);
  res.send("500", "Unexpected server error");
}

function return400(req, res){
  res.send("400", "Bad request");
}

exports.handleError = handleError;
exports.return400 = return400;
