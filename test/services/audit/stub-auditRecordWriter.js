/**
 * Created by dunmail on 07/10/2013 at 10:39
 */

function AuditRecordWriter() {
}

AuditRecordWriter.prototype = {
    constructor: function(){},
    write: function(auditRecord, callback) {
        callback(null);
    }
}

exports.AuditRecordWriter = AuditRecordWriter;
