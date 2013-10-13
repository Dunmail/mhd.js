var constants = require('../../config/constants.js');
var responses = require('../../config/responses.js');

function RepositoryAdapter() {
}

RepositoryAdapter.prototype = {
    constructor: function(){},
    patientIdPattern: constants.patientIdPattern_test,
    getDocumentDossier: function(entryUuid, patientId, format, callback) {
        if (entryUuid == constants.unknownDocumentUuid){
            callback('Unknown Document UUID', null);
            return;
        }

        if (entryUuid == constants.deprecatedDocumentUuid){
            callback('Deprecated Document UUID', null);
            return;
        }

        if (entryUuid == constants.internalErrorDocumentUuid){
            callback('Error thrown for test case', null);
            return;
        }

        if (patientId == constants.unknownPatientId){
            callback('Unknown PatientID', null);
            return;
        }

        if (format == constants.mediaType_unsupported){
            callback('Unsupported media type', null);
            return;
        }

        if (format == constants.mediaType_atom){
            callback('Unsupported media type', null);
            return;
        }

        callback(null, JSON.stringify(responses.getDocumentDossier(entryUuid, patientId)));
    },
    findDocumentDossiers: function(query, format, callback) {
        if (query.PatientID == constants.noDocumentsPatientId) {
            callback('No Document Entries found', null);
            return;
        }

        if (query.PatientID == constants.unknownPatientId){
            callback('Unknown PatientID', null);
            return;
        }

        if (format == constants.mediaType_unsupported){
            callback('Unsupported media type', null);
            return;
        }

        callback(null, JSON.stringify(responses.findDocumentDossiers(query)));
    },
    getDocument: function(entryUuid, patientId, format, callback){
        if (entryUuid == constants.unknownDocumentUuid) {
            callback("Unknown Document UUID", null);
            return;
        }

        if (entryUuid == constants.deprecatedDocumentUuid) {
            callback("Deprecated Document UUID", null);
            return;
        }

        if (patientId == constants.unknownPatientId) {
            callback("Unknown PatientID", null);
            return;
        }

        if (format == constants.mediaType_unsupported){
            callback('Unsupported media type', null);
            return;
        }

        callback(null, responses.getDocument(entryUuid, patientId));
    }
}

exports.RepositoryAdapter = RepositoryAdapter;