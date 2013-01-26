var constants=require("./constants.js");

exports.unknown = constants.root + "unknown";

exports.getDocumentDossierReq = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_uuidMissing = constants.root + "net.ihe/DocumentDossier/?PatientID=" + constants.wellFormedPatientID;
exports.getDocumentDossierReq_uuidMalformed = constants.root + "net.ihe/DocumentDossier/" + constants.malformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_uuidNotKnown = constants.root + "net.ihe/DocumentDossier/" + constants.unknownDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_uuidDeprecated = constants.root + "net.ihe/DocumentDossier/" + constants.deprecatedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentDossierReq_patientIdMissing = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/";
exports.getDocumentDossierReq_patientIdEmpty = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=";
exports.getDocumentDossierReq_patientIdMalformed = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.malformedPatientId;
exports.getDocumentDossierReq_patientIdNotKnown = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.unknownPatientId;

exports.findDocumentDossiersReq = constants.root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.wellformedPatientId;
exports.findDocumentDossiersReq_patientIdMissing = constants.root + "net.ihe/DocumentDossier/search/?";
exports.findDocumentDossiersReq_patientIdEmpty = constants.root + "net.ihe/DocumentDossier/search/?PatientID=";
exports.findDocumentDossiersReq_patientIdMalformed = constants.root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.malformedPatientId;
exports.findDocumentDossiersReq_patientIdNotKnown = constants.root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.unknownPatientId;
exports.findDocumentDossiersReq_patientIdNoDocuments = constants.root + "net.ihe/DocumentDossier/search/?PatientID=" + constants.noDocumentsPatientId;

exports.getDocumentReq = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentReq_uuidMissing = constants.root + "net.ihe/Document/?PatientID=" + constants.wellFormedPatientID;
exports.getDocumentReq_uuidMalformed = constants.root + "net.ihe/Document/" + constants.malformedDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentReq_uuidNotKnown = constants.root + "net.ihe/Document/" + constants.unknownDocumentUuid + "/?PatientID=" + constants.wellformedPatientId;
exports.getDocumentReq_patientIdMissing = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/";
exports.getDocumentReq_patientIdEmpty = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=";
exports.getDocumentReq_patientIdMalformed = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.malformedPatientId;
exports.getDocumentReq_patientIdNotKnown = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + constants.unknownPatientId;

