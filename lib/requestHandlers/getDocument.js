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
  req.xds.getDocument(req.params.entryUuid, req.query.PatientID, function(document){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write(document);
    res.end();
  });	
}

exports.validateRequest = validateRequest;
exports.handle = handle;

