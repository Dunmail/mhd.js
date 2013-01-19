var check = require('validator').check;
var logger = require("../../lib/logger.js");

function validateRequest(req, res, next){
  try{
  	  
    next();
  }
  catch(err){
    sendError(res, 400, "Invalid request");
  }
}

function handle(req, res){
  var documentDossiers = req.xds.findDocumentDossiers();
	
  res.writeHead(200, {"Content-Type": "application.json"});
  res.write(documentDossiers);
  res.end();
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

