var express = require("express");
var http = require("http");
var https = require("https");
var logger = require("../lib/logger.js");
var errorHandler = require("../lib/errorHandler.js");

var getDocumentDossier = require("../lib/requestHandlers/getDocumentDossier.js");
var findDocumentDossiers = require("../lib/requestHandlers/findDocumentDossiers.js");
var getDocument = require("../lib/requestHandlers/getDocument.js");

function start(config)
{
  logger.send("Starting " + config.name);
  var svc = express();
  svc.use(errorHandler.handleServerError);
  //svc.all("/net.ihe/*", requireAuthentication); TODO: implement authentication
  svc.get("/net.ihe/*", function(req, res, next){
	req.xds = config.xds;
	req.patientIdPattern = config.patientIdPattern;
	next();
  });
  svc.get("/net.ihe/DocumentDossier/", function(req, res){res.send(400);});
  svc.get("/net.ihe/DocumentDossier/search/", findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
  svc.get("/net.ihe/DocumentDossier/:entryUuid/", getDocumentDossier.validateRequest, getDocumentDossier.handle);
  svc.get("/net.ihe/Document/", function(req, res){res.send(400);});
  svc.get("/net.ihe/Document/:entryUuid/", getDocument.validateRequest, getDocument.handle);
  svc.get("*", function(req, res){res.send(403)});
  
  //http.createServer(svc).listen(config.port);
  https.createServer(config.options, svc).listen(config.port);

  logger.send(config.name + " listening on port " + config.port);
}

exports.start = start;
