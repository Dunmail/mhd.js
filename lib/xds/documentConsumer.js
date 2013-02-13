var http = require("http");

function DocumentConsumer(registry, repository) {
    this.registry = registry;
    this.repository = repository;
}

DocumentConsumer.prototype = {
    constructor:DocumentConsumer
}

DocumentConsumer.prototype.registryStoredQuery = function (query, callback) {
    var tmp = [];
    tmp.push("<?xml version='1.0' encoding='UTF-8'?>");
    tmp.push("<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope' xmlns:wsa='http://www.w3.org/2005/08/addressing'>");
    tmp.push("<soapenv:Header>");
    tmp.push("<wsa:To>http://" + this.registry.host + ":" + this.registry.port + "/" + this.registry.path + "</wsa:To>");
    tmp.push("<wsa:MessageID>urn:uuid:" + newUuid() + "</wsa:MessageID>");
    tmp.push("<wsa:Action>urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>");
    tmp.push("</soapenv:Header>");
    tmp.push("<soapenv:Body>");
    tmp.push("<query:AdhocQueryRequest xmlns:query='urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0' xmlns:rim='urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0'>");
    tmp.push("<query:ResponseOption returnComposedObjects='true' returnType='" + query.returnType + "' />");
    tmp.push("<rim:AdhocQuery id='urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d'>");
    for (var i = 0; i < query.params.length; i++) {
        tmp.push("<rim:Slot name='$" + query.params[i].name + "'>");
        tmp.push("<rim:ValueList>");
        if (isArray(query.params[i].value)) {
            tmp.push("<rim:Value>(");
            for (var j = 0; j < query.params[i].value.length; j++) {
                tmp.push("'" + query.params[i].value[j] + "'");
            }
            tmp.push(")</rim:Value>");
        }
        else {
            tmp.push("<rim:Value>'" + query.params[i].value + "'</rim:Value>");
        }
        tmp.push("</rim:ValueList>");
        tmp.push("</rim:Slot>");
    }
    tmp.push("</rim:AdhocQuery>");
    tmp.push("</query:AdhocQueryRequest>");
    tmp.push("</soapenv:Body>");
    tmp.push("</soapenv:Envelope>");
    var soap = tmp.join("");

    var options = {};
    options.hostname = this.registry.hostname;
    options.port = this.registry.port;
    options.path = this.registry.path;
    options.method = "POST";
    options.headers = {"Content-Type":"application/soap+xml; charset=UTF-8; action=\"urn:ihe:iti:2007:RegistryStoredQuery\""};
    var req = http.request(options,function (res) {
        callback(null, res);
    }).on('error', function (err) {
            callback(err, null);
        });
    req.write(soap);
    req.end();
}

DocumentConsumer.prototype.retrieveDocumentSet = function (query, callback) {
    var crlf = "\r\n";
    var uuid = newUuid();
    var mimeBoundary = "MIMEBoundaryurn_uuid_" + newUuid();
    var tmp = [];
    tmp.push("<?xml version='1.0' encoding='UTF-8'?>");
    tmp.push("<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope'>");
    tmp.push("  <soapenv:Header xmlns:wsa='http://www.w3.org/2005/08/addressing'>");
    tmp.push("  <wsa:To>http://" + this.repository.host + ":" + this.repository.port + "/" + this.repository.path + "</wsa:To>");
    tmp.push("    <wsa:ReplyTo>");
    tmp.push("      <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>");
    tmp.push("    </wsa:ReplyTo>");
    tmp.push("<wsa:MessageID>urn:uuid:" + newUuid() + "</wsa:MessageID>");
    tmp.push("    <wsa:Action>urn:ihe:iti:2007:RetrieveDocumentSet</wsa:Action>");
    tmp.push("  </soapenv:Header>");
    tmp.push("  <soapenv:Body>");
    tmp.push("    <retrieve:RetrieveDocumentSetRequest xmlns:retrieve='urn:ihe:iti:xds-b:2007'>");
    tmp.push("      <retrieve:DocumentRequest>");
    tmp.push("        <retrieve:RepositoryUniqueId>" + query.RepositoryUniqueId + "</retrieve:RepositoryUniqueId>");
    tmp.push("        <retrieve:DocumentUniqueId>" + query.DocumentUniqueId + "</retrieve:DocumentUniqueId>");
    tmp.push("      </retrieve:DocumentRequest>");
    tmp.push("    </retrieve:RetrieveDocumentSetRequest>");
    tmp.push("  </soapenv:Body>");
    tmp.push("</soapenv:Envelope>");
    var soap = tmp.join("");

    tmp = [];
    tmp.push("--" + mimeBoundary + crlf);
    tmp.push("Content-Type: application/xop+xml; charset=UTF-8; type=\"application/soap+xml\"" + crlf);
    tmp.push("Content-Transfer-Encoding: binary" + crlf);
    tmp.push("Content-ID: <0.urn:uuid:" + uuid + "@apache.org>" + crlf);
    tmp.push(crlf);
    tmp.push(soap + crlf);
    tmp.push( "--" + mimeBoundary + "--");
    var postData = tmp.join("");

    var options = {};
    options.hostname = this.repository.hostname;
    options.port = this.repository.port;
    options.path = this.repository.path;
    options.method = "POST";
    options.headers = {"Content-Type":"multipart/related; boundary=" + mimeBoundary + "; type=\"application/xop+xml\"; start=\"<0.urn:uuid:" + uuid + "@apache.org>\"; start-info=\"application/soap+xml\"; action=\"urn:ihe:iti:2007:RetrieveDocumentSet\"",
        "Content-length":postData.length };
    var req = http.request(options,function (res) {
        callback(null, res);
    }).on('error', function (err) {
            callback(err, null);
        });
    req.write(postData);
    req.end();
}

function isArray(obj) {
    return obj && !(obj.propertyIsEnumerable('length')) && typeof obj === 'object' && typeof obj.length === 'number';
}

//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function newUuid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.DocumentConsumer = DocumentConsumer;


