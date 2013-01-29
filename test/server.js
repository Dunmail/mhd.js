/*
 Server setup to test routing against stub xdsdocumentconsumer
 node mhdstub.js
  */

var https = require("https");
var vows = require("vows");
var check = require("validator").check;
var constants = require("./config/constants.js");
var url = require("./config/url.js");
var urlParser = require("url");
var base64 = require('b64');

var user = constants.goodUser;
var pass = constants.goodPass;
var badUser = constants.badUser;
var badPass = constants.badPass;

function encodeHttpBasicAuthorizationHeader(user, pass) {
    return "Basic " + base64.encode(user + ":" + pass);
}

function getWithoutAuthorization(url, callback) {
    var options = urlParser.parse(url);
    var req = https.request(options, function (res) {
        res.setEncoding("UTF-8");
        var data = "";
        res.on("data", function (chunk) {
            data += chunk.toString();
        });
        res.on("end", function () {
            callback(null, res, data);
        });
    });
    req.on("error", function (e) {
        callback(e, null, null);
    });
    req.end();
}

function get(url, user, pass, callback) {
    var options = urlParser.parse(url);
    options["headers"] = {
        Authorization:encodeHttpBasicAuthorizationHeader(user, pass)
    };
    var req = https.request(options, function (res) {
        res.setEncoding("UTF-8");
        var data = "";
        res.on("data", function (chunk) {
            data += chunk.toString();
        });
        res.on("end", function () {
            callback(null, res, data);
        });
    });
    req.on("error", function (e) {
        callback(e, null, null);
    });
    req.end();
}


vows.describe("Server behaviour").addBatch({
    "when browsing root url":{
        topic:function () {
            get(constants.root, user, pass, this.callback);
        },
        'the status code is 403':function (err, res, data) {
            check(res.statusCode).is(403);
        },
        "the reason phrase is 'Request not supported'":function (err, res, data) {
            check(data).is("Request not supported");
        }
    },
    "when browsing unknown url":{
        topic:function () {
            get(url.unknown, user, pass, this.callback);
        },
        'the status code is 403':function (err, res, data) {
            check(res.statusCode).is(403);
        },
        "the reason phrase is 'Request not supported'":function (err, res, data) {
            check(data).is("Request not supported");
        }
    }
}).addBatch({
        "when url is well-formed but no Authorization header supplied":{
            topic:function () {
                getWithoutAuthorization(url.findDocumentDossiersReq, this.callback);
            },
            'the status code is 401':function (err, res, data) {
                check(res.statusCode).is(401);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                check(data).is("Unauthorized");
            }
        },
        "when url is well-formed but invalid user supplied":{
            topic:function () {
                get(url.findDocumentDossiersReq, badUser, pass, this.callback);
            },
            'the status code is 401':function (err, res, data) {
                check(res.statusCode).is(401);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                check(data).is("Unauthorized");
            }
        },
        "when url is well-formed but invalid pass supplied":{
            topic:function () {
                get(url.findDocumentDossiersReq, user, badPass, this.callback);
            },
            'the status code is 401':function (err, res, data) {
                check(res.statusCode).is(401);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                check(data).is("Unauthorized");
            }
        },
        "when url is well-formed and valid user/pass supplied":{
            topic:function () {
                get(url.findDocumentDossiersReq, user, pass, this.callback);
            },
            'the status code is 200':function (err, res, data) {
                check(res.statusCode).is(200);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                var body = JSON.parse(data);
                //TODO
            }
        }
}).addBatch({
        "when findDocumentDossiers url is well-formed":{
            topic:function () {
                get(url.findDocumentDossiersReq, user, pass, this.callback);
            },
            'the status code is 200':function (err, res, data) {
                check(res.statusCode).is(200);
            },
            'the body is DocumentDossier[] json':function (err, res, data) {
                var body = JSON.parse(data);
                //TODO
            }
        },
        "when findDocumentDossiers url has missing patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdMissing, user, pass, this.callback);
            },
            'the status code is 400':function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when findDocumentDossiers url has empty patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdEmpty, user, pass, this.callback);
            },
            'the status code is 400':function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when findDocumentDossiers url has malformed patientId":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdMalformed, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when findDocumentDossiers url has patientId not known to responder":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdNotKnown, user, pass, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'No Document Entries found'":function (err, res, data) {
                check(data).is("No Document Entries found");
            }
        },
        "when findDocumentDossiers url has patientId for patient with no documents":{
            topic:function () {
                get(url.findDocumentDossiersReq_patientIdNoDocuments, user, pass, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'No Document Entries found'":function (err, res, data) {
                check(data).is("No Document Entries found");
            }
        }
    }).addBatch({
        "when GetDocumentDossier url is well-formed":{
            topic:function () {
                get(url.getDocumentDossierReq, user, pass, this.callback);
            },
            "the status code is 200":function (err, res, data) {
                check(res.statusCode).is(200);
            },
            "the body is DocumentDossier json":function (err, res, data) {
                var body = JSON.parse(data);
            }
        },
        "when GetDocumentDossier url has missing uuid":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidMissing, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has malformed uuid":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidMalformed, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has uuid not known to responder":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidNotKnown, user, pass, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'Document Entry UUID not found'":function (err, res, data) {
                check(data).is("Document Entry UUID not found");
            }
        },
        "when GetDocumentDossier url has uuid for deprecated document":{
            topic:function () {
                get(url.getDocumentDossierReq_uuidDeprecated, user, pass, this.callback);
            },
            "the status code is 410":function (err, res, data) {
                check(res.statusCode).is(410);
            },
            "the reason phrase is 'Document Entry UUID deprecated'":function (err, res, data) {
                check(data).is("Document Entry UUID deprecated");
            }
        },
        "when GetDocumentDossier url has missing patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdMissing, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has empty patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdEmpty, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has malformed patientId":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdMalformed, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocumentDossier url has patientId not known to responder":{
            topic:function () {
                get(url.getDocumentDossierReq_patientIdNotKnown, user, pass, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'Document Entry UUID not found'":function (err, res, data) {
                check(data).is("Document Entry UUID not found");
            }
        }
    }).addBatch({
        "when GetDocument url is well-formed":{
            topic:function () {
                get(url.getDocumentReq, user, pass, this.callback);
            },
            "the status code is 200":function (err, res, data) {
                check(res.statusCode).is(200);
            }
        },
        "when GetDocument url has missing uuid":{
            topic:function () {
                get(url.getDocumentReq_uuidMissing, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has malformed uuid":{
            topic:function () {
                get(url.getDocumentReq_uuidMalformed, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has missing patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdMissing, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has empty patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdEmpty, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has malformed patientId":{
            topic:function () {
                get(url.getDocumentReq_patientIdMalformed, user, pass, this.callback);
            },
            "the status code is 400":function (err, res, data) {
                check(res.statusCode).is(400);
            },
            "the reason phrase is 'Bad Request'":function (err, res, data) {
                check(data).is("Bad Request");
            }
        },
        "when GetDocument url has uuid not known to responder":{
            topic:function () {
                get(url.getDocumentReq_uuidNotKnown, user, pass, this.callback);
            },
            "the status code is 404":function (err, res, data) {
                check(res.statusCode).is(404);
            },
            "the reason phrase is 'Document Entry UUID not found'":function (err, res, data) {
                check(data).is("Document Entry UUID not found");
            }
        }
    }).run();
