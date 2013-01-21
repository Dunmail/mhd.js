var check = require('validator').check;
var error = require("../../lib/errorHandler.js");

function validateRequest(req, res, next){
  try {
    check(req.params.entryUuid).isUUID();
    check(req.query.PatientID).regex(req.patientIdPattern, "i");    
  	  
    next();
  }
  catch(err) {
    error.send(res, 400, "Bad Request");
  }
}

function handle(req, res){
  req.xds.getDocument(req.params.entryUuid, req.query.PatientID, function(err, document){
    if (err == undefined) {
      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write(document);
      res.end();
      return;
    }
    
    if (err == "Unknown Document UUID"){
      error.send(res, 404, "Document Entry UUID not found");
      return;
    }  
 
    if (err == "Unknown PatientID"){
      error.send(res, 404, "Document Entry UUID not found");
      return;
    }
    
    if (err == "Deprecated Document UUID"){
      error.send(res, 410, "Document Entry UUID deprecated");
      return;
    } 
    
    throw "Unexpected error from xds.getDocumentDossier";     
  });	
}

exports.validateRequest = validateRequest;
exports.handle = handle;

