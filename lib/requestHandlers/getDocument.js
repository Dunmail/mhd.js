var logger = require("../../lib/logger.js");

function handle(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(req.xds.getDocument(req.params.entryUuid, req.query.PatientID));
  res.end();
}

function validateRequest(req, res, next){
  if (isValidRequest(req)){
    next();
  }
  else {
    logError(req, 400, "Invalid request");
    sendError(res, 400, "Invalid request");
  }
}

function isValidRequest(req){
  if (req.params.entryUuid == undefined){
    return false;
  }

  if (req.query.PatientID == undefined){
    return false;
  }

  if (req.query.PatientID == 0){
    return false;
  }
  
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
