var express = require("express");
var fs = require("fs");
var err = require("./lib/err/err.js");
var atna = require("./lib/atna/atna.js");
var xds = require("./lib/xds/xds.js");
var server = require("./lib/server.js");

//create helper services
var errorRecordRepository = new err.ErrorRecordRepository(function (errorRecord) {
    fs.exists("./logs", function (exists) {
        if (exists) {
            fs.appendFile("./logs/error.log", errorRecord.toXml() + "\r\n", "utf8", function (err) {
                if (err) throw err;
            });
        }
        else {
            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
            fs.appendFile("./logs/error.log", errorRecord.toXml() + "\r\n", "utf8", function (err) {
                if (err) throw err;
            });
        }
    });
});
var auditRecordRepository = new atna.AuditRecordRepository(function (auditRecord) {
    fs.exists("./logs", function (exists) {
        if (exists) {
            fs.appendFile("./logs/activity.log", auditRecord.toXml() + "\r\n", "utf8", function (err) {
                if (err) throw err;
            });
        }
        else {
            if (!fs.existsSync("./logs")) {
                fs.mkdirSync("./logs");
            }
            fs.appendFile("./logs/activity.log", auditRecord.toXml() + "\r\n", "utf8", function (err) {
                if (err) throw err;
            });
        }
    });
});
var xdsAdapter = new xds.Adapter({hostname:"192.168.10.65", port:2010, path:"/openxds/services/DocumentRegistry/"},
    {hostname:"192.168.10.65", port:2010, path:"/openxds/services/DocumentRepository/"});
var password = [];
password['Dunmail'] = 'letmein';
password['Aladdin'] = 'open sesame';  //Used for unit testing


//create service config
var config = {
        name:"Mobile access to Health Documents (MHD) service",
        port:1337,
        options:{
            key:fs.readFileSync("./cert/key.pem"),
            cert:fs.readFileSync("./cert/cert.pem")
        },
        error:{
            middleware:function (error, req, res, next) {
                var uri = req.protocol + "://" + req.headers["host"] + req.url;
                var ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
                var user = user;
                var outcome = err.ERROR_EXCEPTION;
                var record = new err.ErrorRecord(uri, ip, user, outcome, error.stack);
                errorRecordRepository.recordError(record);
                res.send(500);
            }
        },
        authenticate:{
            middleware:function (req, res, next) {
                var f = express.basicAuth(function (user, pass, callback) {
                    var result = (password[user] && pass === password[user]);
                    if (result) {
                        callback(null, user);
                    }
                    else {
                        //if authentication fails request will be rejected before reaching audit middleware
                        var uri = req.protocol + "://" + req.headers["host"] + req.url;
                        var ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
                        var user = user;
                        var outcome = atna.OUTCOME_MINORFAILURE;
                        var record = new atna.AuditRecord(uri, ip, user, outcome);
                        auditRecordRepository.recordAuditEvent(record);
                        callback(null, false);
                    }
                });
                f(req, res, next);
            }
        },
        audit:{
            middleware:function (req, res, next) {
                var uri = req.protocol + "://" + req.headers["host"] + req.url;
                var ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
                var user = req.user;
                var outcome = atna.OUTCOME_SUCCESS;
                var record = new atna.AuditRecord(uri, ip, user, outcome);
                auditRecordRepository.recordAuditEvent(record);
                next();
            },
            serverEvent:function (id) {
                var ip = "127.0.0.1";
                var user = "SYSTEM";
                var outcome = atna.OUTCOME_SUCCESS;
                var record = new atna.AuditRecord(id, ip, user, outcome);
                auditRecordRepository.recordAuditEvent(record);
            }
        },
        xds:xdsAdapter,
        patientIdPattern:"^[0-9]{9}[\^]{3}[&]2.16.840.1.113883.2.1.3.9.1.0.0&ISO$" //open XDS test system patient identifier
    };

//start server
server.start(config);