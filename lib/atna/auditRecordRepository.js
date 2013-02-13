var AuditRecord_ = require("./auditRecord.js");

function AuditRecordRepository(transport) {
    this.transport = transport;
}

AuditRecordRepository.prototype = {
    constructor:AuditRecordRepository
}

AuditRecordRepository.prototype.recordAuditEvent = function(auditRecord){
    if (auditRecord == null) { throw new TypeError(); }
    if (! (auditRecord instanceof AuditRecord_.AuditRecord)) { throw new TypeError(); }

    this.transport(auditRecord);
}

exports.AuditRecordRepository=AuditRecordRepository;