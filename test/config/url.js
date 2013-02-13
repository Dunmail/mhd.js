var constants=require("./constants.js");

exports.unknown = constants.root + "unknown";

exports.getDocumentDossierReq = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidMissing = constants.root + "net.ihe/DocumentDossier/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidMalformed = constants.root + "net.ihe/DocumentDossier/" + constants.malformedDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidNotKnown = constants.root + "net.ihe/DocumentDossier/" + constants.unknownDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidDeprecated = constants.root + "net.ihe/DocumentDossier/" + constants.deprecatedDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_patientIdMissing = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/";
exports.getDocumentDossierReq_patientIdEmpty = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=";
exports.getDocumentDossierReq_patientIdMalformed = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.malformedPatientId);
exports.getDocumentDossierReq_patientIdNotKnown = constants.root + "net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.unknownPatientId);

exports.findDocumentDossiersReq = constants.root + "net.ihe/DocumentDossier/search?PatientID=" + escape(constants.wellformedPatientId);
exports.findDocumentDossiersReq_patientIdMissing = constants.root + "net.ihe/DocumentDossier/search";
exports.findDocumentDossiersReq_patientIdEmpty = constants.root + "net.ihe/DocumentDossier/search?PatientID=";
exports.findDocumentDossiersReq_patientIdMalformed = constants.root + "net.ihe/DocumentDossier/search?PatientID=" + escape(constants.malformedPatientId);
exports.findDocumentDossiersReq_patientIdNotKnown = constants.root + "net.ihe/DocumentDossier/search?PatientID=" + escape(constants.unknownPatientId);
exports.findDocumentDossiersReq_patientIdNoDocuments = constants.root + "net.ihe/DocumentDossier/search?PatientID=" + escape(constants.noDocumentsPatientId);

exports.getDocumentReq = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentReq_pdf = constants.root + "net.ihe/Document/" + constants.pdfDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidMissing = constants.root + "net.ihe/Document/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidMalformed = constants.root + "net.ihe/Document/" + constants.malformedDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidNotKnown = constants.root + "net.ihe/Document/" + constants.unknownDocumentUuid + "/?PatientID=" + escape(constants.wellformedPatientId);
exports.getDocumentReq_patientIdMissing = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/";
exports.getDocumentReq_patientIdEmpty = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=";
exports.getDocumentReq_patientIdMalformed = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.malformedPatientId);
exports.getDocumentReq_patientIdNotKnown = constants.root + "net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + escape(constants.unknownPatientId);

function escape(text){
  return text.replace(/\^/g, "%5E").replace(/&/g, "%26");
}
