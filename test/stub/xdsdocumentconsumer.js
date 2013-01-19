var constants=require("../config/constants.js");

//In real implementation need to ensure that these functions are non-blocking

//Get Document Dossier [ITI-66]
function getDocumentDossier(entryUuid, patientId)
{
	if (entryUuid == constants.unknownDocumentUuid){
	  return;
	}

	if (patientId == constants.unknownPatientId){
	  return;
	}

	var result = JSON.stringify(constants.documentDossier);
	
	//TODO: How do we determine of document is deprecated?
	
	return result;
}

//Find Document Dossiers [ITI-67]
function findDocumentDossiers()
{
	
	return "xdsDocumentConsumerStub.findDocumentDossiers";
}

//Get Document [ITI-68]
function getDocument(entryUuid, patientId)
{
	return "xdsDocumentConsumerStub.getDocument for " + entryUuid + "[" + patientId + "]";
}

exports.getDocumentDossier = getDocumentDossier;
exports.findDocumentDossiers = findDocumentDossiers;
exports.getDocument = getDocument;
