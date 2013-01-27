var libxmljs = require("libxmljs");
var constants = require("../test/config/constants.js");
var xds = require("../lib/xdsDocumentConsumer.js");

//Get Document Dossier [ITI-66]
function getDocumentDossier(entryUuid, patientId, callback){
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

//TODO: Use dependency injection
var registryOptions = {
  hostname: "192.168.10.65",
  port: 2010,
  path: "/openxds/services/DocumentRegistry/"
};

//Find Document Dossiers [ITI-67]
function findDocumentDossiers(originalUrl, patientId, query, callback){		
	//TODO: How do we determine if PatientID was unknown
	/*if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}*/
	//TODO: Result to unsupported mediatype error 415, 

	
	var xdsQuery = {
		returnType: "ObjectRef",
		params: [{name: "XDSDocumentEntryPatientId", value: patientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
		{name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
	}	
	xds.RegistryStoredQuery(registryOptions, xdsQuery, function(err, res){

		res.setEncoding('UTF-8');
                var body = "";
		res.on("data", function (chunk) {	
		  body = body + chunk.toString();
		});
		res.on("end", function() {
								
		  var xml = libxmljs.parseXmlString(body);

	  	  var timestamp = new Date().toString();

	  	  var entries = [];
		  var objectRefList = xml.find("//rim:ObjectRef", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"});
		  for(var i = 0; i < objectRefList.length; i++){
		  	  var objectRef = objectRefList[i];
		  	  var uuid = objectRef.attr("id").value().replace("urn:uuid:", "");
		  	  
		  	  entry = {};
		  	  entry.id = uuid;
		  	  entry.self = constants.root + "/net.ihe/DocumentDossier/" + uuid + "/?PatientID=" + patientId;
		  	  entry.related = constants.root + "/net.ihe/Document/" + uuid + "/?PatientID=" + patientId;
		  	  entry.updated = timestamp;
		  	  
		  	  entries[i] = entry;
		  }
		  
		  if (entries.length == 0){
		    callback("No Document Entries found", null);
		    return;
		  }
		  
	          var result = {
                    updated:timestamp,
	            self:originalUrl,
  	            entries:entries}
	  	            
		    callback(null, JSON.stringify(result));
	          });
  		  res.on("close", function() {
		  console.log("close");				
			//TODO: error
		    //callback("error", null);
		  });
		});
}


function onError(err){
  console.log('problem with request: ' + err.message);
}

//Get Document [ITI-68]
function getDocument(entryUuid, patientId, callback){
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
	
	callback(null, "xdsDocumentConsumerStub.getDocument for " + entryUuid + "[" + patientId + "]");
}

exports.getDocumentDossier = getDocumentDossier;
exports.findDocumentDossiers = findDocumentDossiers;
exports.getDocument = getDocument;
