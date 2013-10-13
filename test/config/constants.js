/* DocumentUuid */
exports.wellformedDocumentUuid = 'urn:uuid:50a0807a-10a0-7c10-6296-71ed0c235b31';
exports.pdfDocumentUuid = 'urn:uuid:50a0807a-10a0-7c10-6296-71ed0c235b00';
exports.malformedDocumentUuid = 'urn:uuid:14a9fdec0af4-45bb-adf2';
exports.unknownDocumentUuid = 'urn:uuid:10000000-0000-0000-0000-000000000000';
exports.deprecatedDocumentUuid = 'urn:uuid:14a9fdec-0af4-45bb-adf2-d752b4900000';
exports.internalErrorDocumentUuid = 'urn:uuid:eeeeeeee-eee4-eeee-eeee-eeeeeeeeeeee';

/* PatientId */
exports.wellformedPatientId = '223568611^^^&2.16.840.1.113883.2.1.3.9.1.0.0&ISO';
exports.malformedPatientId = '4567856789^^^&2.16.840.1.113883.2.1.3.9.1.0.0&ISO';
exports.unknownPatientId = '223568000^^^&2.16.840.1.113883.2.1.3.9.1.0.0&ISO';
exports.noDocumentsPatientId = '223568612^^^&2.16.840.1.113883.2.1.3.9.1.0.0&ISO';

exports.patientIdPattern_test = '^[0-9]{9}[\^]{3}[&]2.16.840.1.113883.2.1.3.9.1.0.0&ISO$';
exports.patientIdPattern_unvalidatedNHS = '^[0-9]{10}[\^]{3}[&]2.16.840.1.113883.2.1.3.2.4.18.23&ISO$';


exports.mediaType_unsupported = 'application/unsupported';
exports.mediaType_undefined = undefined;
exports.mediaType_any = '*/*';
exports.mediaType_json = 'application/json';
exports.mediaType_html = 'text/html';
exports.mediaType_xml = 'text/xml';
exports.mediaType_atom = 'application/xml+atom';