var libxmljs = require("libxmljs");
var constants = require("../test/config/constants.js");
var xds = require("../lib/xdsDocumentConsumer.js");
var parseHttp = require("../lib/parseHttp.js");

//Get Document Dossier [ITI-66]
function getDocumentDossier(options, entryUuid, patientId, callback){
	//TODO
	if (entryUuid == constants.deprecatedDocumentUuid){
	  callback("Deprecated Document UUID", null);
	  return;
	}

	//TODO
	if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}
	
	var xdsQuery = {
  	      returnType: "LeafClass",
              params: [{name: "XDSDocumentEntryPatientId", value: patientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
                       {name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
            }
	xds.RegistryStoredQuery(options, xdsQuery, function(err, res){
		//preconditions
		if (err){
		  callback(err, null);
		  return;
		}    
		
		if (res == null){
		  callback("XDS Registry did not return response", null);
		  return;
		}
		
		res.setEncoding('UTF-8');
                var body = "";
		res.on("data", function (chunk) {	
		  body = body + chunk.toString();
		});
		res.on("end", function() {
						
		var xml = libxmljs.parseXmlString(body);
		var namespaces ={"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"};
		var extrinsicObject = xml.get("//rim:ExtrinsicObject[@id='" + entryUuid + "']", namespaces);
				
		if (!extrinsicObject){
		  callback("Unknown Document UUID", null);
		  return;
		}

		//TODO: Need to map XDS result to JSON
		
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
	creationTime:extrinsicObject.get("//rim:Slot[@name='creationTime']/rim:ValueList/rim:Value", namespaces).text(),
	hash:extrinsicObject.get("//rim:Slot[@name='hash']/rim:ValueList/rim:Value", namespaces).text(),
	Size:extrinsicObject.get("//rim:Slot[@name='size']/rim:ValueList/rim:Value", namespaces).text(),
	languageCode:extrinsicObject.get("//rim:Slot[@name='languageCode']/rim:ValueList/rim:Value", namespaces).text(),
	serviceStartTime:extrinsicObject.get("//rim:Slot[@name='serviceStartTime']/rim:ValueList/rim:Value", namespaces).text(),
	serviceStopTime:extrinsicObject.get("//rim:Slot[@name='serviceStopTime']/rim:ValueList/rim:Value", namespaces).text(),
	sourcePatientId: extrinsicObject.get("//rim:Slot[@name='sourcePatientId']/rim:ValueList/rim:Value", namespaces).text(),
	mimeType:extrinsicObject.get("@mimeType", namespaces).value(),
	uniqueId:'1.2009.0827.08.33.5074',
	entryUUID:entryUuid}};
	
	callback(null, JSON.stringify(dossier));

	        });
  		res.on("close", function() {
		    callback("error", null);
		});
	});
}

//Find Document Dossiers [ITI-67]
function findDocumentDossiers(options, originalUrl, patientId, query, callback){		
	//TODO: How do we determine if PatientID was unknown
	/*if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}*/
	
	//TODO: Result for unsupported mediatype error 415, 
	
	var xdsQuery = {
		returnType: "ObjectRef",
		params: [{name: "XDSDocumentEntryPatientId", value: patientId + "^^^&amp;2.16.840.1.113883.2.1.3.9.1.0.0&amp;ISO"},
		{name: "XDSDocumentEntryStatus", value: ["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}]
	}	
	xds.RegistryStoredQuery(options, xdsQuery, function(err, res){	
		if (err){
		  callback(err, null);
		  return;
		}    
		
		if (res == null){
		  callback("XDS Registry did not return response", null);
		  return;
		}
		
		res.setEncoding('UTF-8');
                var body = "";
		res.on("data", function (chunk) {	
		  body = body + chunk.toString();
		});
		res.on("end", function() {					
	  	  var objectRefList = libxmljs.parseXmlString(body).find("//rim:ObjectRef", {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"});

		  if (objectRefList.length == 0){
		    callback("No Document Entries found", null);
		    return;
		  }
		  
		  var timestamp = new Date().toString();
		  var entries = [];
		  for(var i = 0; i < objectRefList.length; i++){
		    entries[i] = makeEntry(objectRefList[i], patientId, timestamp);
		  }
		  
	          var result = {
                    updated: timestamp,
	            self: originalUrl,
  	            entries: entries
  	          }
  	          
		  callback(null, JSON.stringify(result));
	        });
  		res.on("close", function() {
		    callback("error", null);
		});
	});
}

function makeEntry(objectRef, patientId, timestamp){
  var uuid = objectRef.attr("id").value();
		  	  
  entry = {};
  entry.id = uuid;
  entry.self = constants.root + "/net.ihe/DocumentDossier/" + uuid + "/?PatientID=" + patientId;
  entry.related = constants.root + "/net.ihe/Document/" + uuid + "/?PatientID=" + patientId;
  entry.updated = timestamp;
		  	  
  return entry;	
}

//Get Document [ITI-68]
function getDocument(options, entryUuid, patientId, callback){
	if (entryUuid == constants.unknownDocumentUuid){
	  callback("Unknown Document UUID", null);
	  return;
	}
	
	//TODO: How we determine that document is deprecated
	if (entryUuid == constants.deprecatedDocumentUuid){
	  callback("Deprecated Document UUID", null);
	  return;
	}
	
	if (patientId == constants.unknownPatientId){
	  callback("Unknown PatientID", null);
	  return;
	}
	
	//TODO: How do query parameters relate to uuid?
	
	var query = {
          RepositoryUniqueId: "2.16.840.1.113883.2.1.3.9.1.2.0",
          DocumentUniqueId: "2.16.840.1.113883.2.1.3.9.105035065001189118.1358955547866.1"
        }
	
	xds.RetrieveDocumentSet(options, query, function(err, res) {
	    if (err) {
		callback(err, null);
		return;
	    }
			
  	    if (res == null){
		callback("XDS Repository did not return response", null);
		return;
	    }

	    
	    parseHttp.splitMultipart(res, function(parts){
                var document = {
                  headers: parts[1].headers,
		  data: parts[1].data
	        }
	
	        callback(null, document);
	      }
            );
        });
	
}

exports.getDocumentDossier = getDocumentDossier;
exports.findDocumentDossiers = findDocumentDossiers;
exports.getDocument = getDocument;
