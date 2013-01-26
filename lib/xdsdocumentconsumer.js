var http = require("http");

function RegistryStoredQuery(options, query, cb){
  var soap = "<?xml version='1.0' encoding='UTF-8'?>";
  soap = soap + "<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope' xmlns:wsa='http://www.w3.org/2005/08/addressing'>";
  soap = soap + "<soapenv:Header>";
  soap = soap + "<wsa:To>http://" + options.host + ":" + options.port + "/" + options.path + "</wsa:To>";
  soap = soap + "<wsa:MessageID>urn:uuid:" + newUuid() + "</wsa:MessageID>";
  soap = soap + "<wsa:Action>urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>";
  soap = soap + "</soapenv:Header>";
  soap = soap + "<soapenv:Body>";
  soap = soap + "<query:AdhocQueryRequest xmlns:query='urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0' xmlns:rim='urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0'>";
  soap = soap + "<query:ResponseOption returnComposedObjects='true' returnType='" + query.returnType + "' />";
  soap = soap + "<rim:AdhocQuery id='urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d'>";
  for (var i = 0; i < query.params.length; i++) {
    soap = soap + "<rim:Slot name='$" + query.params[i].name + "'>";
    soap = soap + "<rim:ValueList>";
    if (isArray(query.params[i].value)){
    	    soap = soap + "<rim:Value>(";
   	    for (var j = 0; j < query.params[i].value.length; j++){
    	      soap = soap + "'" + query.params[i].value[j] + "'";
    	    }
    	    soap = soap + ")</rim:Value>";
    }
    else {
      soap = soap + "<rim:Value>'" + query.params[i].value + "'</rim:Value>";
    }
    soap = soap + "</rim:ValueList>";
    soap = soap + "</rim:Slot>";
  }
  soap = soap + "</rim:AdhocQuery>";
  soap = soap + "</query:AdhocQueryRequest>";
  soap = soap + "</soapenv:Body>";
  soap = soap + "</soapenv:Envelope>";
 
  options.method = "POST";
  options.headers = {"Content-Type" : "application/soap+xml; charset=UTF-8; action=\"urn:ihe:iti:2007:RegistryStoredQuery\""};
  var req = http.request(options, function(res) {cb(null, res);}).on('error', function(err) {cb(err, null);});
  req.write(soap);  
  req.end();
}

function RetrieveDocumentSet(options, query, cb){

  var crlf = "\r\n";
  var mimeBoundary = "MIMEBoundaryurn_uuid_C8F84E54BD8E6D64021359033982993";  //TODO: uuid for MIME boundary
  var soap = "<?xml version='1.0' encoding='UTF-8'?>";
  soap = soap + "<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope'>";
  soap = soap + "  <soapenv:Header xmlns:wsa='http://www.w3.org/2005/08/addressing'>";
  soap = soap +  "  <wsa:To>http://" + options.host + ":" + options.port + "/" + options.path + "</wsa:To>";
  soap = soap + "    <wsa:ReplyTo>";
  soap = soap + "      <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>";
  soap = soap + "    </wsa:ReplyTo>";
  soap = soap +  "<wsa:MessageID>urn:uuid:" + newUuid() + "</wsa:MessageID>";
  soap = soap + "    <wsa:Action>urn:ihe:iti:2007:RetrieveDocumentSet</wsa:Action>";
  soap = soap + "  </soapenv:Header>";
  soap = soap + "  <soapenv:Body>";
  soap = soap + "    <retrieve:RetrieveDocumentSetRequest xmlns:retrieve='urn:ihe:iti:xds-b:2007'>";
  soap = soap + "      <retrieve:DocumentRequest>";
  soap = soap + "        <retrieve:RepositoryUniqueId>" + query.RepositoryUniqueId + "</retrieve:RepositoryUniqueId>";
  soap = soap + "        <retrieve:DocumentUniqueId>" + query.DocumentUniqueId + "</retrieve:DocumentUniqueId>";
  soap = soap + "      </retrieve:DocumentRequest>";
  soap = soap + "    </retrieve:RetrieveDocumentSetRequest>";
  soap = soap + "  </soapenv:Body>";
  soap = soap + "</soapenv:Envelope>";
  
  var postData = "--" + mimeBoundary + crlf;
  postData = postData + "Content-Type: application/xop+xml; charset=UTF-8; type=\"application/soap+xml\"" + crlf;
  postData = postData + "Content-Transfer-Encoding: binary" + crlf;
  postData = postData + "Content-ID: <0.urn:uuid:C8F84E54BD8E6D64021359033982994@apache.org>" + crlf;
  postData = postData + crlf;
  postData = postData + soap + crlf;  
  postData = postData + "--" + mimeBoundary + "--";

  options.method = "POST";
  options.headers = {"Content-Type" : "multipart/related; boundary=MIMEBoundaryurn_uuid_C8F84E54BD8E6D64021359033982993; type=\"application/xop+xml\"; start=\"<0.urn:uuid:C8F84E54BD8E6D64021359033982994@apache.org>\"; start-info=\"application/soap+xml\"; action=\"urn:ihe:iti:2007:RetrieveDocumentSet\"",
                     "Content-length": postData.length };
  var req = http.request(options, function(res) {cb(null, res);}).on('error', function(err) {cb(err, null);});
  req.write(postData);
  req.end();
}

//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function newUuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}

function isArray(obj) {	 
    return obj && !(obj.propertyIsEnumerable('length')) && typeof obj === 'object' && typeof obj.length === 'number';
}

exports.RegistryStoredQuery = RegistryStoredQuery;
exports.RetrieveDocumentSet = RetrieveDocumentSet;


