var check = require('validator').check;

function validateRequest(req, res, next) {
    try {
        check(req.query.PatientID).regex(req.patientIdPattern, "i");

        next();
    }
    catch (err) {
        res.send(400, "Bad Request");
    }
}

function handle(req, res) {
    var params = {
        registry : req.xds.registry,
        originalUrl : req.originalUrl,
        host : req.host,
        port : req.port,
        query : req.query,
        format : req.headers["accept"]
    }

    req.xds.findDocumentDossiers(params, function (err, result) {
        if (err == null) {
            res.writeHead(200, {"Content-Type":"application.json"});
            res.write(result);
            res.end();
            return;
        }

        if (err == "Unknown PatientID") {
            res.send(404, "No Document Entries found");
            return;
        }

        if (err == "No Document Entries found") {
            res.send(404, "No Document Entries found");
            return;
        }

        if (err == "Unsupported media type") {
            res.send(415, "Unsupported media type");
            return;
        }

        throw new Error("Unexpected error from xds.findDocumentDossiers");
    });
}

exports.handle = handle;
exports.validateRequest = validateRequest;
