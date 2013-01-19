var check = require('validator').check;
var error = require("../../lib/errorHandler.js");

function validateRequest(req, res, next){	
  try {
    check(req.params.entryUuid).isUUID();
    check(req.query.PatientID).regex(req.patientIdPattern, "i");
    
    next();
  }
  catch(err) {
    error.send(res, 400, "Invalid request");  
  }
}

function handle(req, res){
  req.xds.getDocumentDossier(req.params.entryUuid, req.query.PatientID, function(dossier){
    if (dossier == undefined){
      error.send(res, 404, "Document Entry UUID not found");
      return;
    }  
  
    if (isDeprecated(dossier)){
      error.send(res, 410, "Document Entry UUID deprecated");
      return;
    }
  
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(dossier);
    res.end();
  });    
}

function isDeprecated(documentDossier){
  //TODO: implement - how do we determine if dossier is deprecated?
  return false;
}

exports.validateRequest = validateRequest;
exports.handle = handle;

