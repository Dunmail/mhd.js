var root = "http://localhost:1337/";
var wellformedDocumentUuid = "784F3E1E-EA70-4E85-9D57-812E68960DF0";
var malformedDocumentUuid = "784F3E1EEA70-4E85-9D57-812E68960DF0";
var unknownDocumentUuid = "10000000-0000-0000-0000-000000000000";
var wellformedPatientId = "4567856789";
var malformedPatientId = "456785678";
var unknownPatientId = "4123456789";

exports.Root = root;
exports.Unknown = root + "unknown";

exports.GetDocumentDossierReq = root + "net.ihe/DocumentDossier/" + wellformedDocumentUuid + "/?PatientID=" + wellformedPatientId;
exports.GetDocumentDossierReq_uuidMissing = root + "net.ihe/DocumentDossier/?PatientID=4567895678";
exports.GetDocumentDossierReq_uuidMalformed = root + "net.ihe/DocumentDossier/" + malformedDocumentUuid + "/?PatientID=" + wellformedPatientId;
exports.GetDocumentDossierReq_uuidNotKnown = root + "net.ihe/DocumentDossier/" + unknownDocumentUuid + "/?PatientID=" + wellformedPatientId;
exports.GetDocumentDossierReq_patientIdMissing = root + "net.ihe/DocumentDossier/" + wellformedDocumentUuid + "/";
exports.GetDocumentDossierReq_patientIdEmpty = root + "net.ihe/DocumentDossier/" + wellformedDocumentUuid + "/?PatientID=";
exports.GetDocumentDossierReq_patientIdMalformed = root + "net.ihe/DocumentDossier/" + wellformedDocumentUuid + "/?PatientID=" + malformedPatientId;
exports.GetDocumentDossierReq_patientIdNotKnown = root + "net.ihe/DocumentDossier/" + unknownDocumentUuid + "/?PatientID=" + wellformedPatientId;

