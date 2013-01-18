var logger = require("../../lib/logger.js");

function handle(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(req.xds.findDocumentDossiers());
  res.end();
}

function validateRequest(req, res, next){
  if (isValidRequest(req)){
    next();
  }
  else{
    logError(req, 400, "Invalid request");
    sendError(res, 400, "Invalid request");
  }
}

function isValidRequest(req){
  //TODO: Provide implementation
  return true;
}

function logError(req, code, msg)
{
  logger.send("Error processing request: " + code + " " + msg); //TODO: Add req url
}

function sendError(res, code, msg){
  res.writeHead(code,  {"Content-Type": "text/plain"});
  res.write(msg);
  res.end();
}

exports.handle = handle;
exports.validateRequest = validateRequest;

