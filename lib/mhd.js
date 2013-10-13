var express = require('express');
var Resolver = require('../lib/services/resolver.js').Resolver;
var getDocumentDossier = require('../lib/requestHandlers/getDocumentDossier.js');
var findDocumentDossiers = require('../lib/requestHandlers/findDocumentDossiers.js');
var getDocument = require('../lib/requestHandlers/getDocument.js');
var audit = require('../lib/services/audit/audit.js');

var app = express();
getDocumentDossier.getService = function (name) {
    return app.getService(name);
}

app.use(audit.logger());
app.use(app.router);


app.get(/\/net.ihe\/DocumentDossier\/$/, sendBadRequest);
app.get('/net.ihe/DocumentDossier/search', findDocumentDossiers.validateRequest, findDocumentDossiers.handle);
app.get('/net.ihe/DocumentDossier/:entryUuid/', getDocumentDossier.validateRequest, getDocumentDossier.handle);
app.get(/\/net.ihe\/Document\/$/, sendBadRequest);
app.get('/net.ihe/Document/:entryUuid/', getDocument.validateRequest, getDocument.handle);
app.get('*', sendRequestNotSupported);


function sendBadRequest(req, res) {
    res.send(400, 'Bad Request');
}

function sendRequestNotSupported(req, res) {
    res.send(403, 'Request not supported');
}

app.registerRepositoryAdapter = function (repositoryAdapter) {
    var resolver = new Resolver();
    resolver.container.register('repositoryAdapter', repositoryAdapter);
};

exports.mhd = app;
