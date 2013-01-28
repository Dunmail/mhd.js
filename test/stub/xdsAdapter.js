var constants=require("../config/constants.js");

//NB: In real implementation need to ensure that these functions are non-blocking

//Get Document Dossier [ITI-66]
function getDocumentDossier(options, entryUuid, patientId, callback){
	if (entryUuid == constants.unknownDocumentUuid){
	  callback("Unknown Document UUID", null);
	  return;
	}

	if (entryUuid == constants.deprecatedDocumentUuid){
	  callback("Deprecated Document UUID", null);
	  return;
	}

	if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}

	var dossier = {
	documentEntry:{
	patientID: patientId,
        classCode: {
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
	entryUUID:'urn:uuid:' + entryUuid}};
	
	callback(null, JSON.stringify(dossier));
}

//Find Document Dossiers [ITI-67]
function findDocumentDossiers(options, originalUrl, patientId, query, callback){
	if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}
	
	if (patientId == constants.noDocumentsPatientId){
	  callback("No Document Entries found", null);
	  return;
	}
	
	//TODO: Result to unsupported mediatype error 415, 

	var timestamp = new Date().toString();
	var result = {
	updated:timestamp,
	self:originalUrl,
	entries:[
	  {
	    id:constants.wellformedDocumentUuid, 
	    self: constants.root + "/net.ihe/DocumentDossier/" + constants.wellformedDocumentUuid + "/?PatientID=" + patientId,  
	    related:constants.root + "/net.ihe/Document/" + constants.wellformedDocumentUuid + "/?PatientID=" + patientId,
	    updated:timestamp}, 
	  {
            id:"123456", 
            self:constants.root + "/net.ihe/DocumentDossier/123456/?PatientID=" + patientId,  
            related:constants.root + "/net.ihe/Document/abcxyz/?PatientID=" + patientId,
            updated:timestamp}, 
          {
            id:"9876",
            self:constants.root + "/net.ihe/DocumentDossier/9876/?PatientID=" + patientId,
            related:constants.root + "/net.ihe/Document/werwer?PatientID=" + patientId,
            updated:timestamp}
        ]}
	
	callback(null, JSON.stringify(result));
}

//Get Document [ITI-68]
function getDocument(options, entryUuid, patientId, callback){
	if (entryUuid == constants.unknownDocumentUuid){
	  callback("Unknown Document UUID", null);
	  return;
	}
	
	if (entryUuid == constants.deprecatedDocumentUuid){
	  callback("Deprecated Document UUID", null);
	  return;
	}
	
	if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}
	
	var content = "<?xml version='1.0' encoding='UTF-8'?>";
        var content = content + "<ClinicalDocument xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns='urn:hl7-org:v3'>";
        var content = content + "<typeId extension='POCD_HD000040' root='2.16.840.1.113883.1.3'/>";
        var content = content + "<templateId root='2.16.840.1.113883.2.1.3.9.10.0.0'/>";
        var content = content + "<id extension='742318311954' root='2.16.840.1.113883.2.1.3.9'/>";
        var content = content + "<code code='57027-5' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Measure Observations'/>";
        var content = content + "<title>Measure Observations</title>";
        var content = content + "<effectiveTime value='20080506143021+0100'/>";
        var content = content + "<confidentialityCode code='N' codeSystem='2.16.840.1.113883.5.25' codeSystemName='HL7' displayName='Normal'/>";
        var content = content + "<languageCode code='en-UK'/>";
        var content = content + "<recordTarget>";
        var content = content + "<patientRole>";
        var content = content + "<id extension='223568611' root='2.16.840.1.113883.2.1.3.9.1.0.0'/>";
        var content = content + "<addr><streetName>60 Hounslow Rd</streetName><city>SMYTHE'S GREEN</city><postalCode>CO5 1VO</postalCode></addr>";
        var content = content + "<patient>";
        var content = content + "<name><family>OWEN</family><given>OLIVER</given></name>";
        var content = content + "<administrativeGenderCode code='M' codeSystem='2.16.840.1.113883.5.1'/>";
        var content = content + "<birthTime value='19331210'/>";
        var content = content + "</patient>";
        var content = content + "</patientRole>";
        var content = content + "</recordTarget>";
        var content = content + "<author>";
        var content = content + "<time value='20080506143021+0100'/>";
        var content = content + "<assignedAuthor>";
        var content = content + "<id extension='593978059683' root='2.16.840.1.113883.2.1.3.9.1.0.0'/>";
        var content = content + "<assignedPerson>";
        var content = content + "<name><family>HOOK</family><given>JAMES</given></name>";
        var content = content + "</assignedPerson>";
        var content = content + "<representedOrganization>";
        var content = content + "<id root='2.16.840.1.113883.2.1.3.9.19.5'/>";
        var content = content + "<name>Good Health Clinic</name>";
        var content = content + "</representedOrganization>";
        var content = content + "</assignedAuthor>";
        var content = content + "</author>";
        var content = content + "<custodian>";
        var content = content + "<assignedCustodian>";
        var content = content + "<representedCustodianOrganization>";
        var content = content + "<id root='2.16.840.1.113883.2.1.3.9.1.1.1.2.0'/>";
        var content = content + "<name>Sintero XDS</name>";
        var content = content + "</representedCustodianOrganization>";
        var content = content + "</assignedCustodian>";
        var content = content + "</custodian>";
        var content = content + "<documentationOf>";
        var content = content + "<serviceEvent classCode='MPROT'>";
        var content = content + "<effectiveTime>";
        var content = content + "<low value='20080506141821'/>";
        var content = content + "<high value='20080506144221+0100'/>";
        var content = content + "</effectiveTime>";
        var content = content + "</serviceEvent>";
        var content = content + "</documentationOf>";
        var content = content + "<component>";
        var content = content + "<structuredBody>";
        var content = content + "<component>";
        var content = content + "<section>";
        var content = content + "<templateId root='2.16.840.1.113883.2.1.3.9.10.1.1'/>";
        var content = content + "<code code='2276-4' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Ferritin'/>";
        var content = content + "<text>06-May-2008 13:30:21 GMT+01:00 Ferritin: 622.0 ug/L</text>";
        var content = content + "<entry>";
        var content = content + "<observation classCode='OBS' moodCode='EVN'>";
        var content = content + "<code code='2276-4' codeSystem='2.16.840.1.113883.6.1' codeSystemName='LOINC' displayName='Ferritin'/>";
        var content = content + "<effectiveTime value='20080506141821'/>";
        var content = content + "<value xsi:type='PQ' unit='ug/L' value='622.0'/>";
        var content = content + "</observation>";
        var content = content + "</entry>";
        var content = content + "</section>";
        var content = content + "</component>";
        var content = content + "</structuredBody>";
        var content = content + "</component>";
        var content = content + "</ClinicalDocument>";

	
	var document = {
	  headers: {
	    "content-type": "text/xml",
	    "content-transfer-encoding": "binary",
	    "content-id": "<1.urn:uuid:BA2B74DD7D946FD24E1359170843006@apache.org>"
	  },
	  data: content
	}
	
	callback(null, document);
}

exports.getDocumentDossier = getDocumentDossier;
exports.findDocumentDossiers = findDocumentDossiers;
exports.getDocument = getDocument;
