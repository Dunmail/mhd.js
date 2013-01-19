var check = require('validator').check;
var logger = require("../../lib/logger.js");

function validateRequest(req, res, next){
  try{
    check(req.query.PatientID).regex(req.patientIdPattern, "i");

    next();
  }
  catch(err){
    sendError(res, 400, "Invalid request");
  }
}

function handle(req, res){
  var documentDossiers = req.xds.findDocumentDossiers(req.originalUrl, req.query.PatientID, req.query);

  if (isUndefined(documentDossiers)){
    sendError(res, 404, "No Document Entries found");
    return;
  }  
  
  res.writeHead(200, {"Content-Type": "application.json"});
  res.write(documentDossiers);
  res.end();
}

function isUndefined(value){
  return value == undefined;
}

function logError(req, code, msg){
  logger.send("Error processing request: " + code + " " + msg); 
}

function sendError(res, code, msg){
  res.writeHead(code,  {"Content-Type": "text/plain"});
  res.write(msg);
  res.end();
}

exports.handle = handle;
exports.validateRequest = validateRequest;
