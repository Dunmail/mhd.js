var check = require("validator").check;

function validateRequest(req, res, next){
  try {
    check(req.params.entryUuid).isUUID();
    check(req.query.PatientID).regex(req.patientIdPattern, "i");    
  	  
    next();
  }
  catch(err) {
    res.send(400, "Bad Request");
  }
}

function handle(req, res){
  req.xds.getDocument(req.xds.repository, req.params.entryUuid, req.query.PatientID, function(err, document){
    if (!err) {
      res.headers = document.headers;
      res.send(document.data);
      return;
    }
    
    if (err == "Unknown Document UUID"){
      res.send(404, "Document Entry UUID not found");
      return;
    }  
 
    if (err == "Unknown PatientID"){
      res.send(404, "Document Entry UUID not found");
      return;
    }
    
    if (err == "Deprecated Document UUID"){
      res.send(410, "Document Entry UUID deprecated");
      return;
    } 
    
    res.send(500, "Unexpected error from xds.getDocumentDossier");     
  });	
}

exports.validateRequest = validateRequest;
exports.handle = handle;

