var express = require("express");
var svc = express();
var logger = require("../lib/logger.js");
var errorHandler = require("../lib/errorHandler.js");
//var requestHandlers = require("../lib/requestHandlers.js");

var getDocumentDossier = require("../lib/requestHandlers/getDocumentDossier.js");
var findDocumentDossiers = require("../lib/requestHandlers/findDocumentDossiers.js");
var getDocument = require("../lib/requestHandlers/getDocument.js");

function start(name, port, xds)
{
  logger.send("Starting " + name);
  svc.use(errorHandler.handleError);
  //svc.all("/net.ihe/*", requireAuthentication); TODO: implement authentication
  svc.get("/net.ihe/*", function(req, res, next){
	req.xds = xds;
	req.patientIdPattern = "^[0-9]{10}$";
	next();
  });
  svc.get("/net.ihe/DocumentDossier/", errorHandler.return400);
  svc.get("/net.ihe/DocumentDossier/search/", findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
  svc.get("/net.ihe/DocumentDossier/:entryUuid/", getDocumentDossier.validateRequest, getDocumentDossier.handle);
  svc.get("/net.ihe/Document/:entryUuid/", getDocument.validateRequest, getDocument.handle);
  svc.listen(port);
  logger.send(name + " listening on port " + port);
}


exports.start = start;
