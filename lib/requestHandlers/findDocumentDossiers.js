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
    try{
      check(result).notNull();
  		  
      res.writeHead(200, {"Content-Type": "application.json"});
      res.write(result);
      res.end();
    }
    catch(err){
      error.send(res, 404, "No Document Entries found");	  
    }
  });
}

exports.handle = handle;
exports.validateRequest = validateRequest;
