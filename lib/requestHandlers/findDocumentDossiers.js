var check = require('validator').check;
var error = require("../../lib/errorHandler.js");

function validateRequest(req, res, next){
  try{
    check(req.query.PatientID).regex(req.patientIdPattern, "i");

    next();
  }
  catch(err){
    error.send(res, 400, "Bad Request");
  }
}

function handle(req, res){
  req.xds.findDocumentDossiers(req.originalUrl, req.query.PatientID, req.query, function(err, result){
    if (err == undefined) {	  
      res.writeHead(200, {"Content-Type": "application.json"});
      res.write(result);
      res.end();
      return;
    }
     
    if (err == "Unknown PatientID"){
      error.send(res, 404, "No Document Entries found");
      return;
    }
    
    if (err == "No Document Entries found"){
      error.send(res, 404, "No Document Entries found");
      return;
    }     
    
    throw "Unexpected error from xds.getDocumentDossier"; 
  });
}

exports.handle = handle;
exports.validateRequest = validateRequest;
