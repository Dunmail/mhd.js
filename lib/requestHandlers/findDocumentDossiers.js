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
  req.xds.findDocumentDossiers(req.originalUrl, req.query.PatientID, req.query, function(result){
    if (result == undefined){
      error.send(res, 404, "No Document Entries found");
    }  
    
    res.writeHead(200, {"Content-Type": "application.json"});
    res.write(result);
    res.end();
  });
}

exports.handle = handle;
exports.validateRequest = validateRequest;
