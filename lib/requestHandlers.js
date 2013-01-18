var xds = require("../lib/xdsDocumentConsumerStub.js");
var logger = require("../lib/logger.js");

function getDocumentDossier(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(xds.getDocumentDossier(req.params.entryUuid));
  res.end();
}

function validateGetDocumentDossierRequest(req, res, next){
  if (isValidGetDocumentDossierRequest(req)){
    next();
  }
  else {
    logError(req, 400, "Invalid request")
    sendError(res, 400, "Invalid request");  
  }
}

function isValidGetDocumentDossierRequest(req){
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

function findDocumentDossiers(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(xds.findDocumentDossiers());
  res.end();
}

function validateFindDocumentDossiersRequest(req, res, next){
  if (isValidGetDocumentRequest(req)){
    next();
  }
  else{
    logError(req, 400, "Invalid request");
    sendError(res, 400, "Invalid request");
  }
}

function isValidGetDocumentDossierRequest(req){
  //TODO: Provide implementation
  return true;
}

function getDocument(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(xds.getDocument(req.params.entryUuid, req.query.PatientID));
  res.end();
}

function validateGetDocumentRequest(req, res, next){
  if (isValidGetDocumentRequest(req)){
    next();
  }
  else {
    logError(req, 400, "Invalid request");
    sendError(res, 400, "Invalid request");
  }
}

function isValidGetDocumentRequest(req){
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

exports.getDocumentDossier = getDocumentDossier;
exports.validateGetDocumentDossierRequest = validateGetDocumentDossierRequest;
exports.findDocumentDossiers = findDocumentDossiers;
exports.validateFindDocumentDossiersRequest = validateFindDocumentDossiersRequest;
exports.getDocument = getDocument;
exports.validateGetDocumentRequest = validateGetDocumentRequest;

