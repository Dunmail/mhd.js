var AuditRecord_ = require("./auditRecord.js");
var AuditRecordRepository_ = require("./auditRecordRepository.js");

exports.AuditRecord=AuditRecord_.AuditRecord;
exports.OUTCOME_SUCCESS = AuditRecord_.OUTCOME_SUCCESS;
exports.OUTCOME_MINORFAILURE = AuditRecord_.OUTCOME_MINORFAILURE;
exports.OUTCOME_SERIOUSFAILURE = AuditRecord_.OUTCOME_SERIOUSFAILURE;
exports.OUTCOME_MAJORFAILURE = AuditRecord_.OUTCOME_MAJORFAILURE;
exports.AuditRecordRepository=AuditRecordRepository_.AuditRecordRepository;