var libxmljs = require("libxmljs");
var sanitize = require("validator").sanitize;
var xds = require("./xds.js");
var parseHttp = require("../parseHttp.js");

var namespaces = {"rim":"urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"};
var classificationSchemeUnknown = "";
var classificationSchemeclassCode = classificationSchemeUnknown;
var classificationSchemeconfidentialityCode = "urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f";
var classificationSchemeformatCode = "urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d";
var classificationSchemetypeCode = "urn:uuid:f0306f51-975f-434e-a61c-c59651d33983";
var classificationSchemeAuthor = "urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d";
var classificationSchemepracticeSettingCodes = "urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead";

function Adapter(registry, repository){
    this.documentConsumer = new xds.DocumentConsumer(registry, repository);
}

Adapter.prototype = {
    constructor: Adapter
}

//Get Document Dossier [ITI-66]
Adapter.prototype.getDocumentDossier = function(entryUuid, patientId, callback) {
    var xdsQuery = {
        returnType:"LeafClass",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(patientId).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    this.documentConsumer.registryStoredQuery(xdsQuery, function (err, res) {
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

//Find Document Dossiers [ITI-67]
Adapter.prototype.findDocumentDossiers = function(params, callback) {
    if (!(params.format == null || params.format == "application/json" || params.format == "application/xml+atom" )) {
        callback("Unsupported media type", null);
        return;
    }

    var xdsQuery = {
        returnType:"ObjectRef",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(params.query.PatientID).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    this.documentConsumer.registryStoredQuery(xdsQuery, function (err, res) {
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
                entries[i] = makeEntry(objectRefList[i], params, timestamp);
            }

            var result = {
                updated:timestamp,
                self:params.originalUrl,
                entries:entries
            };

            if (params.format == "application/xml+atom") {
                callback(null, atomise(result));
            }
            else {

                callback(null, JSON.stringify(result));
            }
        });
        res.on("close", function () {
            callback("error", null);
        });
    });
}

//Get Document [ITI-68]
Adapter.prototype.getDocument = function(entryUuid, patientId, callback) {
    var _documentConsumer = this.documentConsumer;
    var registryQuery = {
        returnType:"LeafClass",
        params:[
            {name:"XDSDocumentEntryPatientId", value:sanitize(patientId).entityEncode()},
            {name:"XDSDocumentEntryStatus", value:["urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"]}
        ]
    };
    _documentConsumer.registryStoredQuery(registryQuery, function (err, res) {
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

            _documentConsumer.retrieveDocumentSet(repositoryQuery, function (err, res) {
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

function getAttributeValue(xmlElement, name) {
    return xmlElement.get(name, namespaces).value();
}

function getSlotValue(xmlElement, name) {
    var node = xmlElement.get("//rim:Slot[@name='" + name + "']/rim:ValueList/rim:Value", namespaces);
    if (node) {
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


function atomise(result) {
    var tmp = [];
    tmp.push("<?xml version='1.0' encoding='utf-8'?>");
    tmp.push("<feed xmlns='http://www.w3.org/2005/Atom'>");
    tmp.push("<title>MHD findDocumentDossiers response</title>");
    tmp.push("<updated>" + result.updated + "</updated>");
    tmp.push("<id>" + result.self + "</id>");
    tmp.push("<author>");
    tmp.push("<name>MHD Document Responder</name>");
    tmp.push("</author>");
    tmp.push("<generator uri='https://github.com/Dunmail/mhd.js' version='0.2'>mhd.js</generator>");
    tmp.push("<link rel='self' href='" + result.self + "'/>");

    for (var i = 0; i < result.entries.length; i++) {
        var entry = result.entries[i];
        tmp.push("<entry>");
        tmp.push("<id>" + entry.id + "</id>");
        tmp.push("<title>" + entry.id + "</title>");
        tmp.push("<link rel='self' href='" + entry.self + "'/>");
        tmp.push("<link rel='related' href='" + entry.related + "'/>");
        tmp.push("<updated>" + result.updated + "</updated>");
        tmp.push("</entry>");
    }
    tmp.push("</feed>");


    return tmp.join("");
}
function makeEntry(objectRef, params, timestamp) {
    var entryUuid = objectRef.attr("id").value();

    var entry = {};
    entry.id = entryUuid;
    entry.self = "https://" + params.host + ":" + params.port + "/net.ihe/DocumentDossier/" + entryUuid + "/?PatientID=" + escape(params.query.PatientID);
    entry.related = "https://" + params.host + ":" + params.port + "/net.ihe/Document/" + entryUuid + "/?PatientID=" + escape(params.query.PatientID);
    entry.updated = timestamp;

    return entry;
}

function escape(text) {
    return text.replace(/\^/g, "%5E").replace(/&/g, "%26");
}

exports.Adapter=Adapter;