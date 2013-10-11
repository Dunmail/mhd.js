var Resolver = require('../services/resolver.js').Resolver;
var Repository = require('../services/repository/repository.js').Repository;
var check = require('validator').check;

function validateRequest(req, res, next) {
    try {
        var resolver = new Resolver();
        var repository = new Repository(resolver.container);
        var pattern = repository.getPatientIdPattern();

        check(req.query.PatientID).regex(pattern, "i");

        next();
    }
    catch (err) {
        res.send(400, "Bad Request");
    }
}

function handle(req, res) {
    var resolver = new Resolver();
    var repository = new Repository(resolver.container);

    repository.findDocumentDossiers(req.query, req.headers['accept'], function (err, result) {

        if (err == null) {
            var contentType = req.headers['accept'] == 'application/xml+atom' ? 'application/xml+atom' : 'application/json';
            res.writeHead(200, {"Content-Type":contentType});
            res.write(result);
            res.end();
            return;
        }

        if (err == 'Unknown PatientID') {
            res.send(404, 'No Document Entries found');
            return;
        }

        if (err == 'No Document Entries found') {
            res.send(404, 'No Document Entries found');
            return;
        }

        if (err == 'Unsupported media type') {
            res.send(415, 'Unsupported media type');
            return;
        }

        throw new Error('Unexpected error from repository.findDocumentDossiers: ' + err);
    });
}

exports.validateRequest = validateRequest;
exports.handle = handle;

