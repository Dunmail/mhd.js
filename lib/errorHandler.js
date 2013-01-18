var logger = require("../lib/logger.js");

function handleError(err, req, res, next)
{
  logger.send(err.stack);
  res.send("500", "Unexpected server error");
}

exports.handleError = handleError;
