var mhd = require('../lib/mhd.js').mhd;

var RepositoryAdapter = require('./services/repository/stub-repositoryAdapter.js').RepositoryAdapter;

var assert = require('assert');
var check = require('validator').check;
var request = require('supertest');
var sinon = require('sinon');
var constants = require('./config/constants.js');
var routes = require('./config/routes.js');
var responses = require('./config/responses.js');

describe('mhd', function () {
    var adapter = new RepositoryAdapter();

    var adapter_getDocumentDossier_spy;

    beforeEach(function () {
        mhd.registerRepositoryAdapter(adapter);

        adapter_getDocumentDossier_spy = sinon.spy(adapter, 'getDocumentDossier');

    });

    afterEach(function () {
        adapter.getDocumentDossier.restore();
    });

    describe('get', function () {
        it('/ returns 403', function (done) {
            request(mhd)
                .get('/')
                .expect(403, 'Request not supported', done);
        });

        it('/unknown returns 403 "Request not supported"', function (done) {
            request(mhd)
                .get(routes.unknown)
                .expect(403, 'Request not supported', done);
        });

        describe('/net.ihe/DocumentDossier/', function () {
            it('returns 200', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .expect(200, done);
            });

            it('returns 200 if Accept header undefined', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/json', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Accept', constants.mediaType_json)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept */*', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Accept', constants.mediaType_any)
                    .expect('Content-Type',  constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/xml+atom', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Accept', constants.mediaType_atom)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if query missing', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid missing', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_uuidMissing)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid malformed', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_uuidMalformed)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if uuid not known to responder', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_uuidNotKnown)
                    .expect(404, 'Document Entry UUID not found', done);
            });

            it('returns 410 "Document Entry UUID deprecated" if uuid for deprecated document', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_uuidDeprecated)
                    .expect(410, 'Document Entry UUID deprecated', done);
            });

            it('returns 500 if internal error', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_uuidInternalError)
                    .expect(500, done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_patientIdMissing)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_patientIdEmpty)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_patientIdMalformed)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if patientId not known to responder', function (done) {
                request(mhd)
                    .get(routes.getDocumentDossierReq_patientIdNotKnown)
                    .expect(404, 'Document Entry UUID not found', done);
            });
        });

        describe('/net.ihe/DocumentDossier/search', function () {
            it('returns 200 if Accept header undefined', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/json', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Accept', constants.mediaType_json)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept */*', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Accept', constants.mediaType_any)
                    .expect('Content-Type',  constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/xml+atom', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Accept', constants.mediaType_atom)
                    .expect('Content-Type',  constants.mediaType_atom)
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_patientIdMissing)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_patientIdEmpty)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_patientIdMalformed)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "No Document Entries found" if patientId not known to responder', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_patientIdNotKnown)
                    .expect(404, 'No Document Entries found', done);
            });

            it('returns 404 "No Document Entries found" if patient has no documents', function (done) {
                request(mhd)
                    .get(routes.findDocumentDossiersReq_patientIdNoDocuments)
                    .expect(404, 'No Document Entries found', done);
            });
        });

        describe('/net.ihe/Document/', function () {
            it('returns 200', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_wellformed)
                    .expect(200, done);
            });

            it('returns document if Accept header undefined', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_wellformed)
                    .expect('Content-Type', constants.mediaType_html + '; charset=utf-8')
                    .expect(200, done);
            });

            it('returns document if Accept */*', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Accept', constants.mediaType_any)
                    //.expect('Content-Type',  constants.mediaType_html + '; charset=utf-8')
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if uuid missing', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_uuidMissing)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid malformed', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_uuidMalformed)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if uuid not known to responder', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_uuidNotKnown)
                    .expect(404, 'Document Entry UUID not found', done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_patientIdMissing)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_patientIdEmpty)
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(mhd)
                    .get(routes.getDocumentReq_patientIdMalformed)
                    .expect(400, 'Bad Request', done);
            });
        });
    });
});

