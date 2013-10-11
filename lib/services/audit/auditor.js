var Resolver = require('../resolver.js').Resolver;
var AuditRecord = require('./auditRecord.js').AuditRecord;
var assert = require('assert');
var check = require('validator').check;

function Auditor() {

}

Auditor.prototype = {
    constructor:Auditor,
    notify:function (uri, ip, user, outcome, callback) {
        try {
            preconditions(uri, ip, user, outcome, callback);

            var writer = this.getWriter();
            var auditRecord = new AuditRecord(uri, ip, user, outcome);
            writer.write(auditRecord, function (err) {
                callback(err);
            });
        }
        catch (ex) {
            callback(ex);
        }

        function preconditions(uri, ip, user, outcome, callback) {
            //TODO: check args.count = 5
            check(uri).notNull();
            check(ip).notNull();
            check(user).notNull();
            check(outcome).notNull();
            check(callback).notNull();
        }
    },
    getWriter:function () {
        var me = this;
        preconditions();

        var writer = Resolver().container.get('auditRecordWriter');

        postconditions(writer);
        return writer;

        function preconditions() {

        }

        function postconditions(writer) {
            check(writer).notNull();
            check(writer.write).notNull();
        }
    }
}

exports.Auditor = Auditor;