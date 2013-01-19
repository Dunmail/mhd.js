var check = require('validator').check;
var logger = require("../../lib/logger.js");

function validateRequest(req, res, next){	
  try {
    check(req.params.entryUuid).isUUID();
    check(req.query.PatientID).regex(req.patientIdPattern, "i");
    
    next();
  }
  catch(err) {
    sendError(res, 400, "Invalid request");  
  }
}

function handle(req, res){
  var documentDossier = req.xds.getDocumentDossier(req.params.entryUuid, req.query.PatientID);
  
  if (isUndefined(documentDossier)){
    sendError(res, 404, "Document Entry UUID not found");
    return;
  }  
  
  if (isDeprecated(documentDossier)){
    sendError(res, 410, "Document Entry UUID deprecated");
    return;
  }
  
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(req.xds.getDocumentDossier(req.params.entryUuid));
  res.end();
}

function isUndefined(value){
  return value == undefined;
}

function isDeprecated(documentDossier){
  //TODO: implement - how do we determine if dossier is deprecated?
  return false;
}

function logError(req, code, msg)
{
  logger.send("Error processing request: " + code + " " + msg);
}

function sendError(res, code, msg){
  res.writeHead(code,  {"Content-Type": "text/plain"});
  res.write(msg);
  res.end();
}

exports.validateRequest = validateRequest;
exports.handle = handle;

