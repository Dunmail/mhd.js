var express = require("express");
var https = require("https");
var getDocumentDossier = require("../lib/requestHandlers/getDocumentDossier.js");
var findDocumentDossiers = require("../lib/requestHandlers/findDocumentDossiers.js");
var getDocument = require("../lib/requestHandlers/getDocument.js");

function start(config) {
    /*
    process.on("uncaughtException", function(err){
        if (config.audit.serverEvent) {
            config.audit.serverEvent("Started " + config.name);
        }
    });
    */

    console.log("Starting " + config.name);
    var app = express();

    //middleware
    if (config.authenticate.middleware) {
        app.use(config.authenticate.middleware);
    }
    if (config.audit.middleware) {
        app.use(config.audit.middleware);
    }
    app.use(app.router);
    if (config.error.middleware) {
        app.use(config.error.middleware);
    }

    //routing
    app.get("/net.ihe/*", function (req, res, next) {
        req.xds = config.xds;
        req.patientIdPattern = config.patientIdPattern;
        req.port = config.port;
        next();
    });
    app.get("/net.ihe/DocumentDossier/", function (req, res) {
        res.send(400, "Bad Request");
    });
    app.get("/net.ihe/DocumentDossier/search", findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
    app.get("/net.ihe/DocumentDossier/:entryUuid/", getDocumentDossier.validateRequest, getDocumentDossier.handle);
    app.get("/net.ihe/Document/", function (req, res) {
        res.send(400, "Bad Request");
    });
    app.get("/net.ihe/Document/:entryUuid/", getDocument.validateRequest, getDocument.handle);
    app.get("*", function (req, res) {
        res.send(403, "Request not supported")
    });

    //start service
    var svc = https.createServer(config.options, app);
    svc.on("close", function(){
        if (config.audit.serverEvent) {
            config.audit.serverEvent("Stopped " + config.name);
        }
    })
    svc.listen(config.port);

    //audit
    if (config.audit.serverEvent) {
        config.audit.serverEvent("Started " + config.name);
    }
    console.log(config.name + " listening on port " + config.port);
}

exports.start = start;
