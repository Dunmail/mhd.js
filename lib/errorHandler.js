var logger = require("../lib/logger.js");

function handleServerError(err, req, res, next){
  logger.send(err.stack);
  res.send(500);
}

function logError(req, code, msg){
  logger.send("Error processing request: " + code + " " + msg);
}

function send(res, code, msg){
  res.writeHead(code,  {"Content-Type": "text/plain"});
  res.write(msg);
  res.end();
}

exports.handleServerError = handleServerError;
exports.logError = logError;
exports.send = send;

