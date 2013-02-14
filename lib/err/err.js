var ErrorRecord_ = require("./errorRecord.js");
var ErrorRecordRepository_ = require("./errorRecordRepository.js");

exports.ErrorRecord = ErrorRecord_.ErrorRecord;
exports.ERROR_EXCEPTION = ErrorRecord_.ERROR_EXCEPTION;
exports.ERROR_WARNING = ErrorRecord_.ERROR_WARNING;
exports.ERROR_INFORMATION = ErrorRecord_.ERROR_INFORMATION;

exports.ErrorRecordRepository=ErrorRecordRepository_.ErrorRecordRepository;
