var constants=require("./constants.js");
var root = "http://localhost:1337/";

exports.root = root;
exports.unknown = root + "unknown";

exports.getDocumentDossierReq = root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_uuidMissing = root + "net.ihe/DocumentDossier/?PatientID=" + constants.wellFormedPatientID;
exports.getDocumentDossierReq_uuidMalformed = root + "net.ihe/DocumentDossier/" + constants.malformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_uuidNotKnown = root + "net.ihe/DocumentDossier/" + constants.unknownDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_patientIdMissing = root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/";
exports.getDocumentDossierReq_patientIdEmpty = root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=";
exports.getDocumentDossierReq_patientIdMalformed = root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.malformedPatientId;
exports.getDocumentDossierReq_patientIdNotKnown = root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.unknownPatientId;

exports.findDocumentDossiersReq = root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.wellformedPatientId;
exports.findDocumentDossiersReq_patientIdMissing = root + "net.ihe/DocumentDossier/search/";
exports.findDocumentDossiersReq_patientIdEmpty = root + "net.ihe/DocumentDossier/search/?PatientID=";
exports.findDocumentDossiersReq_patientIdMalformed = root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.malformedPatientId;
exports.findDocumentDossiersReq_patientIdNotKnown = root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.unknownPatientId;

