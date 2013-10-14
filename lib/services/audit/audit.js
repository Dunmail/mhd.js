var fs = require('fs');
var express = require('express');

var OUTCOME_SUCCESS = '0';
var OUTCOME_MINORFAILURE = '4';
var OUTCOME_SERIOUSFAILURE = '8';
var OUTCOME_MAJORFAILURE = '12';

function logger(dir){

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    };

    var writeStream = fs.createWriteStream(dir + '/activity.log', {'flags': 'a'});
    writeStream.write(atnaAuditMessage_ServerStart());
    writeStream.write('\n');
    writeStream.on('error', function (err) {
        console.log(err);
    });

    express.logger.token('user', function(req, res){
        return req.user || 'unauthenticated';
    });

    express.logger.token('outcome', function(req, res){
        return res.statusCode == 200 ? OUTCOME_SUCCESS : OUTCOME_MINORFAILURE;
    });

    express.logger.token('isodate', function(req, res){
        return new Date().toISOString();
    });

    return express.logger({format:atnaAuditMessageTemplate(), stream:writeStream});
}

function atnaAuditMessageTemplate(){
    var tmp = [];
    tmp.push('<AuditMessage>');
    tmp.push('<EventIdentification>');
    tmp.push('<EventID EventDateTime=":isodate" EventOutcomeIndicator=":outcome">');
    tmp.push(':method :url');
    tmp.push('</EventID>');
    tmp.push('</EventIdentification>');
    tmp.push('<ActiveParticipant UserID=":user" NetworkAccessPointID=":remote-addr" NetworkAccessPointTypeCode="2"/>'); //2=IP Address
    tmp.push('<AuditSourceIdentification>');
    tmp.push('<AuditSourceTypeCode code="3" AuditSourceID="mhd.js" />');  //3=Web server process
    tmp.push('</AuditSourceIdentification>');
    tmp.push('<Description>');
    tmp.push(':method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent"  - :response-time ms');
    tmp.push('</Description>');
    tmp.push('</AuditMessage>');
    return tmp.join('');
}

function atnaAuditMessage_ServerStart(){
    var tmp = [];
    tmp.push('<AuditMessage>');
    tmp.push('<EventIdentification>');
    tmp.push('<EventID EventDateTime="' + new Date().toISOString() + '" EventOutcomeIndicator="0">');
    tmp.push('Service started');
    tmp.push('</EventID>');
    tmp.push('</EventIdentification>');
    tmp.push('<ActiveParticipant UserID="SYSTEM" NetworkAccessPointID="local" NetworkAccessPointTypeCode="2"/>'); //2=IP Address
    tmp.push('<AuditSourceIdentification>');
    tmp.push('<AuditSourceTypeCode code="3" AuditSourceID="mhd.js" />');  //3=Web server process
    tmp.push('</AuditSourceIdentification>');
    tmp.push('</AuditMessage>');
    return tmp.join('');
}

exports.logger = logger;
exports.OUTCOME_SUCCESS = OUTCOME_SUCCESS;
exports.OUTCOME_MINORFAILURE = OUTCOME_MINORFAILURE;
exports.OUTCOME_SERIOUSFAILURE = OUTCOME_SERIOUSFAILURE;
exports.OUTCOME_MAJORFAILURE = OUTCOME_MAJORFAILURE;
