var ErrorRecord_ = require("./errorRecord.js");

function ErrorRecordRepository(transport) {
    this.transport = transport;
}

ErrorRecordRepository.prototype = {
    constructor:ErrorRecordRepository
}

ErrorRecordRepository.prototype.recordError = function(errorRecord){
    if (errorRecord == null) { throw new TypeError(); }
    if (! (errorRecord instanceof ErrorRecord_.ErrorRecord)) { throw new TypeError(); }

    this.transport(errorRecord);
}

exports.ErrorRecordRepository=ErrorRecordRepository;
