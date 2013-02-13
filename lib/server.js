var express = require("express");
var https = require("https");
var logger = require("../lib/logger.js");
var errorHandler = require("../lib/errorHandler.js");
var getDocumentDossier = require("../lib/requestHandlers/getDocumentDossier.js");
var findDocumentDossiers = require("../lib/requestHandlers/findDocumentDossiers.js");
var getDocument = require("../lib/requestHandlers/getDocument.js");

function start(config) {
    logger.send("Starting " + config.name);
    var svc = express();
    svc.use(errorHandler.handleServerError);

    if (config.authenticate) { svc.use(config.authenticate); }
    if (config.audit.middleware) { svc.use(config.audit.middleware); }

    svc.get("/net.ihe/*", function (req, res, next) {
        req.xds = config.xds;
        req.patientIdPattern = config.patientIdPattern;
        req.port = config.port;
        next();
    });
    svc.get("/net.ihe/DocumentDossier/", function (req, res) {
        res.send(400, "Bad Request");
    });
    svc.get("/net.ihe/DocumentDossier/search", findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
    svc.get("/net.ihe/DocumentDossier/:entryUuid/", getDocumentDossier.validateRequest, getDocumentDossier.handle);
    svc.get("/net.ihe/Document/", function (req, res) {
        res.send(400, "Bad Request");
    });
    svc.get("/net.ihe/Document/:entryUuid/", getDocument.validateRequest, getDocument.handle);
    svc.get("*", function (req, res) {
        res.send(403, "Request not supported")
    });

    https.createServer(config.options, svc).listen(config.port);

    logger.send(config.name + " listening on port " + config.port);
}

exports.start = start;
