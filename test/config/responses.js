var constants = require('./constants.js');
var urls = require('./urls.js');
var routes = require('./routes.js');

exports.getDocumentDossier = function (entryUuid, patientId) {
    var response = {
        documentEntry:{
            patientID:patientId,
            classCode:{
                code:'34133 -9',
                codingScheme:'2.16.840.1.113883.6.1',
                codeName:'Summary of Episode Note'},
            confidentialityCode:{
                code:'N',
                codingScheme:'2.16.840.1.113883.5.25',
                codeName:'Normal sensitivity'},
            formatCode:{
                code:'urn:ihe:lab:xd-lab:2008',
                codingScheme:'1.3.6.1.4.1.19376.1.2.3',
                codeName:'XD-Lab'},
            typeCode:{
                code:'',
                codingScheme:'',
                codeName:''},
            Author:{
                todo:'need to expand this!!!'},
            practiceSettingCodes:{
                code:'394802001',
                codingScheme:'2.16.840.1.113883.6.96',
                codeName:'General Medicine'},
            Title:'document title',
            creationTime:'20061224',
            hash:'e543712c0e10501972de13a5bfcbe826c49feb75',
            Size:'350',
            languageCode:'en-us',
            serviceStartTime:'200612230800',
            serviceStopTime:'200612230900',
            sourcePatientId:'4567856789^^^&3.4.5&ISO',
            mimeType:'text/xml',
            uniqueId:'1.2009.0827.08.33.5074',
            entryUUID:entryUuid}};

    return response;
}

var timestamp = new Date().toString();
exports.findDocumentDossiers = function (query) {
    var response = {
        updated:timestamp,
        self:urls.root + routes.findDocumentDossiersReq_wellformed,
        entries:[
            {
                id:constants.wellformedDocumentUuid,
                self:constants.root + "/net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + query.PatientID,
                related:constants.root + "/net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + query.PatientID,
                updated:timestamp},
            {
                id:"123456",
                self:constants.root + "/net.ihe/DocumentDossier/" + constants.deprecatedDocumentUuid + "/?PatientID=" + query.PatientID,
                related:constants.root + "/net.ihe/Document/" + constants.deprecatedDocumentUuid + "/?PatientID=" + query.PatientID,
                updated:timestamp},
            {
                id:"9876",
                self:constants.root + "/net.ihe/DocumentDossier/" + constants.pdfDocumentUuid + "/?PatientID=" + query.PatientID,
                related:constants.root + "/net.ihe/Document/" + constants.pdfDocumentUuid + "/?PatientID=" + query.PatientID,
                updated:timestamp}
        ]};

    return response;
}

exports.getDocument = function(entryUuid, patientId){
    var tmp = [];
    tmp.push("<?xml version='1.0' encoding='UTF-8'?>");
    tmp.push("<ClinicalDocument xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns='urn:hl7-org:v3'>");
    tmp.push("<typeId extension='POCD_HD000040' root='2.16.840.1.113883.1.3'/>");
    tmp.push("<templateId root='2.16.840.1.113883.2.1.3.9.10.0.0'/>");
    tmp.push("<id extension='742318311954' root='2.16.840.1.113883.2.1.3.9'/>");
    tmp.push("<code code='57027-5' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Measure Observations'/>");
    tmp.push("<title>Measure Observations</title>");
    tmp.push("<effectiveTime value='20080506143021+0100'/>");
    tmp.push("<confidentialityCode code='N' codeSystem='2.16.840.1.113883.5.25' codeSystemName='HL7' displayName='Normal'/>");
    tmp.push("<languageCode code='en-UK'/>");
    tmp.push("<recordTarget>");
    tmp.push("<patientRole>");
    tmp.push("<id extension='223568611' root='2.16.840.1.113883.2.1.3.9.1.0.0'/>");
    tmp.push("<addr><streetName>60 Hounslow Rd</streetName><city>SMYTHE'S GREEN</city><postalCode>CO5 1VO</postalCode></addr>");
    tmp.push("<patient>");
    tmp.push("<name><family>OWEN</family><given>OLIVER</given></name>");
    tmp.push("<administrativeGenderCode code='M' codeSystem='2.16.840.1.113883.5.1'/>");
    tmp.push("<birthTime value='19331210'/>");
    tmp.push("</patient>");
    tmp.push("</patientRole>");
    tmp.push("</recordTarget>");
    tmp.push("<author>");
    tmp.push("<time value='20080506143021+0100'/>");
    tmp.push("<assignedAuthor>");
    tmp.push("<id extension='593978059683' root='2.16.840.1.113883.2.1.3.9.1.0.0'/>");
    tmp.push("<assignedPerson>");
    tmp.push("<name><family>HOOK</family><given>JAMES</given></name>");
    tmp.push("</assignedPerson>");
    tmp.push("<representedOrganization>");
    tmp.push("<id root='2.16.840.1.113883.2.1.3.9.19.5'/>");
    tmp.push("<name>Good Health Clinic</name>");
    tmp.push("</representedOrganization>");
    tmp.push("</assignedAuthor>");
    tmp.push("</author>");
    tmp.push("<custodian>");
    tmp.push("<assignedCustodian>");
    tmp.push("<representedCustodianOrganization>");
    tmp.push("<id root='2.16.840.1.113883.2.1.3.9.1.1.1.2.0'/>");
    tmp.push("<name>Sintero XDS</name>");
    tmp.push("</representedCustodianOrganization>");
    tmp.push("</assignedCustodian>");
    tmp.push("</custodian>");
    tmp.push("<documentationOf>");
    tmp.push("<serviceEvent classCode='MPROT'>");
    tmp.push("<effectiveTime>");
    tmp.push("<low value='20080506141821'/>");
    tmp.push("<high value='20080506144221+0100'/>");
    tmp.push("</effectiveTime>");
    tmp.push("</serviceEvent>");
    tmp.push("</documentationOf>");
    tmp.push("<component>");
    tmp.push("<structuredBody>");
    tmp.push("<component>");
    tmp.push("<section>");
    tmp.push("<templateId root='2.16.840.1.113883.2.1.3.9.10.1.1'/>");
    tmp.push("<code code='2276-4' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Ferritin'/>");
    tmp.push("<text>06-May-2008 13:30:21 GMT+01:00 Ferritin: 622.0 ug/L</text>");
    tmp.push("<entry>");
    tmp.push("<observation classCode='OBS' moodCode='EVN'>");
    tmp.push("<code code='2276-4' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Ferritin'/>");
    tmp.push("<effectiveTime value='20080506141821'/>");
    tmp.push("<value xsi:type='PQ' unit='ug/L' value='622.0'/>");
    tmp.push("</observation>");
    tmp.push("</entry>");
    tmp.push("</section>");
    tmp.push("</component>");
    tmp.push("</structuredBody>");
    tmp.push("</component>");
    tmp.push("</ClinicalDocument>");
    var data = tmp.join("");

    var document = {
        headers:{
            "content-type":constants.mediaType_xml,
            "content-transfer-encoding":"binary",
            "content-id":"<1.urn:uuid:BA2B74DD7D946FD24E1359170843006@apache.org>"
        },
        data:data
    }

    return document;
}
