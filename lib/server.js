var express = require("express");
var svc = express();
var logger = require("../lib/logger.js");
var errorHandler = require("../lib/errorHandler.js");
var requestHandlers = require("../lib/requestHandlers.js");

function start(name, port, xds)
{
  logger.send("Starting " + name);
  svc.use(errorHandler.handleError);
  //svc.all("/net.ihe/*", requireAuthentication); TODO: implement authentication
  svc.get("/net.ihe/*", function(req, res, next){
	req.xds = xds;
	next();
  });
  svc.get("/net.ihe/DocumentDossier/:entryUuid/", requestHandlers.validateGetDocumentDossierRequest, requestHandlers.getDocumentDossier);
  //svc.get("/net.ihe/DocumentDossier/search", requestHandlers.validateFindDocumentDossiersRequest, requestHandlers.findDocumentDossiers);
  //svc.get("/net.ihe/Document/:entryUuid/", requestHandlers.validateGetDocumentRequest, requestHandlers.getDocument);
  svc.listen(port);
  logger.send(name + " listening on port " + port);
}


exports.start = start;
