var libxmljs = require("libxmljs");
var sanitize = require("validator").sanitize;
var constants = require("../test/config/constants.js");
var xds = require("../lib/xdsDocumentConsumer.js");
var parseHttp = require("../lib/parseHttp.js");

var namespaces = {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"};

//Get Document Dossier [ITI-66]
function getDocumentDossier(options, entryUuid, patientId, callback) {
    //TODO
//    if (entryUuid == constants.deprecatedDocumentUuid) {
//        callback("Deprecated Document UUID", null);
//        return;
//    }

    //TODO
//    if (patientId == constants.unknownPatientId) {
//        callback("Unknown PatientID", null);
//        return;
//    }

    var xdsQuery = {
        returnType:"LeafClass",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(patientId).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    xds.RegistryStoredQuery(options, xdsQuery, function (err, res) {
        //preconditions
        if (err) {
            callback(err, null);
            return;
        }

        if (res == null) {
            callback("XDS Registry did not return response", null);
            return;
        }

        res.setEncoding('UTF-8');
        var body = "";
        res.on("data", function (chunk) {
            body = body + chunk.toString();
        });
        res.on("end", function () {
            var xml = libxmljs.parseXmlString(body);

            var extrinsicObject = xml.get("//rim:ExtrinsicObject[@id='" + entryUuid + "']", namespaces);

            if (!extrinsicObject) {
                callback("Unknown Document UUID", null);
                return;
            }

            var dossier = makeDossier(extrinsicObject, patientId, entryUuid);
            callback(null, JSON.stringify(dossier));

        });
        res.on("close", function () {
            callback("error", null);
        });
    });
}

function makeDossier(xmlElement, patientId, entryUuid) {
    var dossier = {
        documentEntry:{
            patientID:patientId
        }};

    dossier.documentEntry["classCode"] = getClassificationValue(xmlElement, classificationSchemeclassCode);
    dossier.documentEntry["confidentialityCode"] = getClassificationValue(xmlElement, classificationSchemeconfidentialityCode);
    dossier.documentEntry["formatCode"] = getClassificationValue(xmlElement, classificationSchemeformatCode);
    dossier.documentEntry["typeCode"] = getClassificationValue(xmlElement, classificationSchemetypeCode);
    dossier.documentEntry["Author"] = getAuthorValue(xmlElement);
    dossier.documentEntry["practiceSettingCodes"] = getClassificationValue(xmlElement, classificationSchemepracticeSettingCodes);


    dossier.documentEntry["Title"] = xmlElement.get("//rim:Name/rim:LocalizedString/@value", namespaces).value();
    dossier.documentEntry["creationTime"] = getSlotValue(xmlElement, "creationTime");
    dossier.documentEntry["hash"] = getSlotValue(xmlElement, "hash");
    dossier.documentEntry["Size"] = getSlotValue(xmlElement, "size");
    dossier.documentEntry["languageCode"] = getSlotValue(xmlElement, "languageCode");
    dossier.documentEntry["serviceStartTime"] = getSlotValue(xmlElement, "serviceStartTime");
    dossier.documentEntry["serviceStopTime"] = getSlotValue(xmlElement, "serviceStopTime");
    dossier.documentEntry["sourcePatientId"] = getSlotValue(xmlElement, "sourcePatientId");

    dossier.documentEntry["mimeType"] = getAttributeValue(xmlElement, "@mimeType");
    dossier.documentEntry["uniqueId"] = xmlElement.get("//rim:ExternalIdentifier[rim:Name/rim:LocalizedString[@value='XDSDocumentEntry.uniqueId']]/@value", namespaces).value();
    dossier.documentEntry["entryUUID"] = entryUuid;

    return dossier;
}

var classificationSchemeUnknown = "";
var classificationSchemeclassCode = classificationSchemeUnknown;
var classificationSchemeconfidentialityCode = "urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f";
var classificationSchemeformatCode = "urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d";
var classificationSchemetypeCode = "urn:uuid:f0306f51-975f-434e-a61c-c59651d33983";
var classificationSchemeAuthor = "urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d";
var classificationSchemepracticeSettingCodes = "urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead";

function getAttributeValue(xmlElement, name) {
    return xmlElement.get(name, namespaces).value();
}

function getSlotValue(xmlElement, name) {
    var node = xmlElement.get("//rim:Slot[@name='" + name + "']/rim:ValueList/rim:Value", namespaces);
    if (node){
      return node.text();
    }
    else {
       return "";
    }
}

function getClassificationValue(xmlElement, name) {
    var classification = {code:"", codingScheme:"", codeName:""};
    var classificationNode = xmlElement.get("//rim:Classification[@classificationScheme='" + name + "']", namespaces);
    if (classificationNode) {
        classification["code"] = classificationNode.get("@nodeRepresentation", namespaces).value();
        classification["codingScheme"] = classificationNode.get("rim:Slot[@name='codingScheme']/rim:ValueList/rim:Value", namespaces).text();
        classification["codeName"] = classificationNode.get("rim:Name/rim:LocalizedString/@value", namespaces).value();
    }
    return classification;
}

function getAuthorValue(xmlElement) {
    var author = {authorInstitution:"", authorPerson:"", authorRole:"", authorSpecialty:""};
    var classificationNode = xmlElement.get("//rim:Classification[@classificationScheme='" + classificationSchemeAuthor + "']", namespaces);
    if (classificationNode) {
        author["authorInstitution"] = getSlotValue(classificationNode, "authorInstitution");
        author["authorPerson"] = getSlotValue(classificationNode, "authorPerson");
        author["authorRole"] = getSlotValue(classificationNode, "authorRole");
        author["authorSpecialty"] = getSlotValue(classificationNode, "authorSpecialty");
    }
    return author;
}

//Find Document Dossiers [ITI-67]
function findDocumentDossiers(options, originalUrl, patientId, query, callback) {
    //TODO: How do we determine if PatientID was unknown?
    /*if (patientId == constants.unknownPatientId){
     callback("Unknown PatientID", null);
     return;
     }*/
    //TODO: Result for unsupported mediatype error 415,
    //TODO: parse query for additional parameters

    var xdsQuery = {
        returnType:"ObjectRef",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(patientId).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    xds.RegistryStoredQuery(options, xdsQuery, function (err, res) {
        if (err) {
            callback(err, null);
            return;
        }

        if (res == null) {
            callback("XDS Registry did not return response", null);
            return;
        }

        res.setEncoding('UTF-8');
        var body = "";
        res.on("data", function (chunk) {
            body = body + chunk.toString();
        });
        res.on("end", function () {
            var objectRefList = libxmljs.parseXmlString(body).find("//rim:ObjectRef", namespaces);

            if (objectRefList.length == 0) {
                callback("No Document Entries found", null);
                return;
            }

            var timestamp = new Date().toString();
            var entries = [];
            for (var i = 0; i < objectRefList.length; i++) {
                entries[i] = makeEntry(objectRefList[i], patientId, timestamp);
            }

            var result = {
                updated:timestamp,
                self:originalUrl,
                entries:entries
            };

            callback(null, JSON.stringify(result));
        });
        res.on("close", function () {
            callback("error", null);
        });
    });
}

function makeEntry(objectRef, patientId, timestamp) {
    var entryUuid = objectRef.attr("id").value();

    var entry = {};
    entry.id = entryUuid;
    entry.self = constants.root + "net.ihe/DocumentDossier/" + entryUuid + "/?PatientID=" + escape(patientId);
    entry.related = constants.root + "net.ihe/Document/" + entryUuid + "/?PatientID=" + escape(patientId);
    entry.updated = timestamp;

    return entry;
}

function escape(text) {
    return text.replace(/\^/g, "%5E").replace(/&/g, "%26");
}

//Get Document [ITI-68]
function getDocument(registryOptions, repositoryOptions, entryUuid, patientId, callback) {
    //TODO: How we determine that document is deprecated
//    if (entryUuid == constants.deprecatedDocumentUuid) {
//        callback("Deprecated Document UUID", null);
//        return;
//    }

    //TODO: How do we determine if PatientID is unknown
//    if (patientId == constants.unknownPatientId) {
//        callback("Unknown PatientID", null);
//        return;
//    }

    var registryQuery = {
        returnType:"LeafClass",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(patientId).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    xds.RegistryStoredQuery(registryOptions, registryQuery, function (err, res) {
        //preconditions
        if (err) {
            callback(err, null);
            return;
        }

        if (res == null) {
            callback("XDS Registry did not return response", null);
            return;
        }

        res.setEncoding('UTF-8');
        var body = "";
        res.on("data", function (chunk) {
            body = body + chunk.toString();
        });
        res.on("end", function () {
            var xml = libxmljs.parseXmlString(body);
            var extrinsicObject = xml.get("//rim:ExtrinsicObject[@id='" + entryUuid + "']", namespaces);

            if (!extrinsicObject) {
                callback("Unknown Document UUID", null);
                return;
            }

            var repositoryQuery = {
                RepositoryUniqueId:extrinsicObject.get("//rim:Slot[@name='repositoryUniqueId']/rim:ValueList/rim:Value", namespaces).text(),
                DocumentUniqueId:extrinsicObject.get("//rim:ExternalIdentifier[rim:Name/rim:LocalizedString[@value='XDSDocumentEntry.uniqueId']]/@value", namespaces).value()
            };
            xds.RetrieveDocumentSet(repositoryOptions, repositoryQuery, function (err, res) {
                if (err) {
                    callback(err, null);
                    return;
                }

                if (!res) {
                    callback("XDS Repository did not return response", null);
                    return;
                }

                parseHttp.splitMultipart(res, function (parts) {
                        var document = {
                            headers:parts[1].headers,
                            data:parts[1].data
                        };

                        callback(null, document);
                    }
                );
            });
        });
    });
}

exports.getDocumentDossier = getDocumentDossier;
exports.findDocumentDossiers = findDocumentDossiers;
exports.getDocument = getDocument;
