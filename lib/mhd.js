var express = require('express');
var Resolver = require('../lib/services/resolver.js').Resolver;
var getDocumentDossier = require('../lib/requestHandlers/getDocumentDossier.js');
var findDocumentDossiers = require('../lib/requestHandlers/findDocumentDossiers.js');
var getDocument = require('../lib/requestHandlers/getDocument.js');
var audit = require('../lib/services/audit/audit.js');

function svc(config) {
    var resolver = new Resolver();
    resolver.container.register('repositoryAdapter', config.repositoryAdapter);

    var app = express();

    app.use(config.middleware.logger);
    app.use(config.middleware.authentication);
    app.use(app.router);
    app.use(unsupportedRequestHandler);

    app.get(/\/net.ihe\/DocumentDossier\/$/, badRequestHandler);
    app.get('/net.ihe/DocumentDossier/search', findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
    app.get('/net.ihe/DocumentDossier/:entryUuid/', getDocumentDossier.validateRequest, getDocumentDossier.handle);
    app.get(/\/net.ihe\/Document\/$/, badRequestHandler);
    app.get('/net.ihe/Document/:entryUuid/', getDocument.validateRequest, getDocument.handle);

    return app;
}

function badRequestHandler(req, res, next){
    res.send(400, 'Bad Request');
}

function unsupportedRequestHandler(req, res, next){
    res.send(403, 'Request not supported');
}

function basicAuth(f){
    return express.basicAuth(f);
}

exports.logger = audit.logger;
exports.basicAuth = basicAuth;
exports.app = svc;
