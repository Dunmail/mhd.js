var check = require('validator').check;
var logger = require("../../lib/logger.js");

function validateRequest(req, res, next){
  try {
    check(req.params.entryUuid).isUUID();
    check(req.query.PatientID).regex(req.patientIdPattern, "i");    
  	  
    next();
  }
  catch(err) {
    sendError(res, 400, "Invalid request");
  }
}

function handle(req, res){
  var document = req.xds.getDocument(req.params.entryUuid, req.query.PatientID);
	
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write(result);
  res.end();
}


function logError(req, code, msg)
{
  logger.send("Error processing request: " + code + " " + msg);
}

function sendError(res, code, msg){
  res.writeHead(code,  {"Content-Type": "text/plain"});
  res.write(msg);
  res.end();
}

exports.validateRequest = validateRequest;
exports.handle = handle;

