var constants=require('./constants.js');

exports.unknown = '/unknown';

exports.getDocumentDossierReq = '/net.ihe/DocumentDossier/';
exports.getDocumentDossierReq_wellformed = '/net.ihe/DocumentDossier/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidMissing = '/net.ihe/DocumentDossier/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidMalformed = '/net.ihe/DocumentDossier/' + constants.malformedDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidNotKnown = '/net.ihe/DocumentDossier/' + constants.unknownDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_uuidDeprecated = '/net.ihe/DocumentDossier/' + constants.deprecatedDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentDossierReq_patientIdMissing = '/net.ihe/DocumentDossier/' + constants.wellformedDocumentUuid + '/';
exports.getDocumentDossierReq_patientIdEmpty = '/net.ihe/DocumentDossier/' + constants.wellformedDocumentUuid + '/?PatientID=';
exports.getDocumentDossierReq_patientIdMalformed = '/net.ihe/DocumentDossier/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.malformedPatientId);
exports.getDocumentDossierReq_patientIdNotKnown = '/net.ihe/DocumentDossier/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.unknownPatientId);

exports.findDocumentDossiersReq = '/net.ihe/DocumentDossier/';
exports.findDocumentDossiersReq_wellformed = '/net.ihe/DocumentDossier/search?PatientID=' + escape(constants.wellformedPatientId);
exports.findDocumentDossiersReq_patientIdMissing = '/net.ihe/DocumentDossier/search';
exports.findDocumentDossiersReq_patientIdEmpty = '/net.ihe/DocumentDossier/search?PatientID=';
exports.findDocumentDossiersReq_patientIdMalformed = '/net.ihe/DocumentDossier/search?PatientID=' + escape(constants.malformedPatientId);
exports.findDocumentDossiersReq_patientIdNotKnown = '/net.ihe/DocumentDossier/search?PatientID=' + escape(constants.unknownPatientId);
exports.findDocumentDossiersReq_patientIdNoDocuments = '/net.ihe/DocumentDossier/search?PatientID=' + escape(constants.noDocumentsPatientId);

exports.getDocumentReq = '/net.ihe/Document/';
exports.getDocumentReq_wellformed = '/net.ihe/Document/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentReq_pdf = '/net.ihe/Document/' + constants.pdfDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidMissing = '/net.ihe/Document/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidMalformed = '/net.ihe/Document/' + constants.malformedDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentReq_uuidNotKnown = '/net.ihe/Document/' + constants.unknownDocumentUuid + '/?PatientID=' + escape(constants.wellformedPatientId);
exports.getDocumentReq_patientIdMissing = '/net.ihe/Document/' + constants.wellformedDocumentUuid + '/';
exports.getDocumentReq_patientIdEmpty = '/net.ihe/Document/' + constants.wellformedDocumentUuid + '/?PatientID=';
exports.getDocumentReq_patientIdMalformed = '/net.ihe/Document/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.malformedPatientId);
exports.getDocumentReq_patientIdNotKnown = '/net.ihe/Document/' + constants.wellformedDocumentUuid + '/?PatientID=' + escape(constants.unknownPatientId);

function escape(text){
    return text.replace(/\^/g, '%5E').replace(/&/g, '%26');
}