var Resolver = require('../services/resolver.js').Resolver;
var Repository = require('../services/repository/repository.js').Repository;
var check = require('validator').check;

function validateRequest(req, res, next) {
    try {
        check(req.params.entryUuid).contains("urn:uuid:");
        check(req.params.entryUuid.substr(9)).isUUID();

        var repository = new Repository(Resolver.container);
        var pattern = repository.getPatientIdPattern();

        check(req.query.PatientID).regex(pattern, "i");

        next();
    }
    catch (err) {
        res.send(400, "Bad Request");
    }
}

function handle(req, res){
    var resolver = new Resolver();
    var repository = new Repository(resolver.container);
    repository.getDocumentDossier(req.params.entryUuid, req.query.PatientID, req.headers['accept'], function (err, dossier) {

        if (!err) {
            res.writeHead(200, {"Content-Type":"application/json"});
            res.write(dossier);
            res.end();
            return;
        }

        if (err == 'Unknown Document UUID') {
            res.send(404, 'Document Entry UUID not found');
            return;
        }

        if (err == 'Unknown PatientID') {
            res.send(404, 'Document Entry UUID not found');
            return;
        }

        if (err == 'Deprecated Document UUID') {
            res.send(410, 'Document Entry UUID deprecated');
            return;
        }

        if (err == 'Unsupported media type') {
            res.send(415, 'Unsupported media type');
            return;
        }

        throw err;
    });
}

exports.validateRequest = validateRequest;
exports.handle = handle;

