var http = require("http");

function ObjectRefsForPatientId(err, options, cb){
  options.method = "POST";
  options.headers = {"content-type" : "application/soap+xml; charset=UTF-8; action=\"urn:ihe:iti:2007:RegistryStoredQuery\""};
  
  var req = http.request(options, cb).on('error', err);

  req.write("<?xml version='1.0' encoding='UTF-8'?>");
  req.write("<soapenv:Envelope xmlns:soapenv='http://www.w3.org/2003/05/soap-envelope' xmlns:wsa='http://www.w3.org/2005/08/addressing'>");
  req.write("<soapenv:Header>");
  req.write("<wsa:To>http://" + options.host + ":" + options.port + "/" + options.path + "</wsa:To>");
  req.write("<wsa:MessageID>urn:uuid:F347E1483350B8D6511198803333967</wsa:MessageID>");
  req.write("<wsa:Action>urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>");
  req.write("</soapenv:Header>");
  req.write("<soapenv:Body>");
  req.write("<query:AdhocQueryRequest xmlns:query='urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0' xmlns:rim='urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0'>");
  req.write("<query:ResponseOption returnComposedObjects='true' returnType='ObjectRef' />");
  req.write("<rim:AdhocQuery id='urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d'>");
  req.write("<rim:Slot name='$XDSDocumentEntryPatientId'>");
  req.write("<rim:ValueList>");
  req.write("<rim:Value>'" + options.patientId + "'</rim:Value>");
  req.write("</rim:ValueList>");
  req.write("</rim:Slot>");
  req.write("<rim:Slot name='$XDSDocumentEntryStatus'>");
  req.write("<rim:ValueList>");
  req.write("<rim:Value>('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')</rim:Value>");
  req.write("</rim:ValueList>");
  req.write("</rim:Slot>");
  req.write("</rim:AdhocQuery>");
  req.write("</query:AdhocQueryRequest>");
  req.write("</soapenv:Body>");
  req.write("</soapenv:Envelope>");
  req.end();
}

exports.ObjectRefsForPatientId = ObjectRefsForPatientId;
