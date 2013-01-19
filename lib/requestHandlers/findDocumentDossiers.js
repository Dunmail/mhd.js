var check = require('validator').check;
var error = require("../../lib/errorHandler.js");

function validateRequest(req, res, next){
  try{
    check(req.query.PatientID).regex(req.patientIdPattern, "i");

    next();
  }
  catch(err){
    error.send(res, 400, "Invalid request");
  }
}

function handle(req, res){
  var documentDossiers = req.xds.findDocumentDossiers(req.originalUrl, req.query.PatientID, req.query);

  if (isUndefined(documentDossiers)){
    error.send(res, 404, "No Document Entries found");
    return;
  }  
  
  res.writeHead(200, {"Content-Type": "application.json"});
  res.write(documentDossiers);
  res.end();
}

function isUndefined(value){
  return value == undefined;
}

exports.handle = handle;
exports.validateRequest = validateRequest;
