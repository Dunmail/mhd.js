


function AuditRecordRepository(recordAuditEvent) {
    this["recordAuditEvent"] = recordAuditEvent;
}

AuditRecordRepository.prototype = {
    constructor:AuditRecordRepository(transport)
}

AuditRecordRepository.prototype.recordAuditEvent(auditRecord){
    if (auditRecord == null) { throw new TypeError(); }
    if (! (auditRecord instanceof AuditRecord)) { throw new TypeError(); }

   recordAuditEvent(auditRecord);
}