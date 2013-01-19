exports.wellformedDocumentUuid = "14a9fdec-0af4-45bb-adf2-d752b49bcc7d";
exports.malformedDocumentUuid = "14a9fdec0af4-45bb-adf2";
exports.unknownDocumentUuid = "10000000-0000-0000-0000-000000000000";
exports.wellformedPatientId = "4567856789";
exports.malformedPatientId = "456785678";
exports.unknownPatientId = "4123456789";

//TODO: Sample taken from trial implementation. Notes indicate not complete - need to provide a complete sample
exports.documentDossier = {documentEntry:{
	patientID: '144ba3c4aad24e9^^^&1.3.6.1.4.1.21367.2005.3.7&ISO',
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
	entryUUID:'urn:uuid:14a9fdec-0af4-45bb-adf2-d752b49bcc7d'}}

exports.findDocumentDossiers = {
  updated:"Sun Oct 21 2011 12:34:28 GMT-0700",
  self:"http://example.com/foo/bar/net.ihe/DocumentDossier/search?key=value&foo=bar",
  entries:[
    {
      id:"123456", 
      self:"http://example.com/foo/bar/net.ihe/DocumentDossier/123456",  
      related:"http://example.com/foo/bar/net.ihe/Document/abcxyz",
      updated:"Sun Oct 21 2011 12:34:28 GMT-0700"}, 
    {
      id:"9876",
      self:"http://example.com/foo/bar/net.ihe/DocumentDossier/9876",
      related:"http://example.com/foo/bar/net.ihe/Document/werwer",
      updated:"Sun Oct 28 2011 08:34:28 GMT-0700"
    }]
}
	
