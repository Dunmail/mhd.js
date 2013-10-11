/**
 * Created by dunmail on 07/10/2013 at 10:36
 */
var Auditor_ = require('./auditor.js');
var AuditRecord_ = require('./auditRecord.js');

exports.Auditor = Auditor_.Auditor;
exports.OUTCOME_SUCCESS = AuditRecord_.OUTCOME_SUCCESS;
exports.OUTCOME_MINORFAILURE = AuditRecord_.OUTCOME_MINORFAILURE;
exports.OUTCOME_SERIOUSFAILURE = AuditRecord_.OUTCOME_SERIOUSFAILURE;
exports.OUTCOME_MAJORFAILURE = AuditRecord_.OUTCOME_MAJORFAILURE;