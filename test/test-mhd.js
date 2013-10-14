var RepositoryAdapter = require('./services/repository/stub-repositoryAdapter.js').RepositoryAdapter;

var mhd = require('../lib/mhd.js');

var assert = require('assert');
var check = require('validator').check;
var request = require('supertest');
var sinon = require('sinon');
var constants = require('./config/constants.js');
var routes = require('./config/routes.js');
var responses = require('./config/responses.js');
var b64 = require('b64');

var config = {
    repositoryAdapter: new RepositoryAdapter(),
    middleware: {
        logger: mhd.logger('./logs/'),
        authentication: mhd.basicAuth(function(user, pass, callback){
            if (user == constants.goodUser && pass == constants.goodPass){
                callback(null, user);
            }
            else {
                callback(null, false);
            }
        })
    }
}
var app = mhd.app(config);

describe('mhd.app', function () {
    var adapter = config.repositoryAdapter;

    var adapter_getDocumentDossier_spy;

    beforeEach(function () {
        adapter_getDocumentDossier_spy = sinon.spy(adapter, 'getDocumentDossier');
    });

    afterEach(function () {
        adapter.getDocumentDossier.restore();
    });

    describe('authentication', function (done) {
        it('/net.ihe/DocumentDossier/ returns 200 if user known and password correct', function (done) {
            request(app)
                .get(routes.getDocumentDossierReq_wellformed)
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                .expect(200, done);
        });

        it('/net.ihe/DocumentDossier/ returns 401 if user unknown', function (done) {
            request(app)
                .get(routes.getDocumentDossierReq_wellformed)
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.badUser, constants.goodPass))
                .expect(401, done);
        });

        it('/net.ihe/DocumentDossier/ returns 401 if password incorrect', function (done) {
            request(app)
                .get(routes.getDocumentDossierReq_wellformed)
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.badPass))
                .expect(401, done);
        });

        it('/net.ihe/DocumentDossier/ returns 401 if user unknown and password incorrect', function (done) {
            request(app)
                .get(routes.getDocumentDossierReq_wellformed)
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.badUser, constants.badPass))
                .expect(401, done);
        });
    });

    describe('get', function () {
        it('/ returns 403', function (done) {
            request(app)
                .get('/')
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                .expect(403, 'Request not supported', done);
        });

        it('/unknown returns 403 "Request not supported"', function (done) {
            request(app)
                .get(routes.unknown)
                .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                .expect(403, 'Request not supported', done);
        });

        describe('/net.ihe/DocumentDossier/', function () {
            it('returns 200', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(200, done);
            });

            it('returns 200 if Accept header undefined', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/json', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_json)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept */*', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_any)
                    .expect('Content-Type',  constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/xml+atom', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_atom)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if query missing', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid missing', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_uuidMissing)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid malformed', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_uuidMalformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if uuid not known to responder', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_uuidNotKnown)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(404, 'Document Entry UUID not found', done);
            });

            it('returns 410 "Document Entry UUID deprecated" if uuid for deprecated document', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_uuidDeprecated)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(410, 'Document Entry UUID deprecated', done);
            });

            it('returns 500 if internal error', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_uuidInternalError)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(500, done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_patientIdMissing)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_patientIdEmpty)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_patientIdMalformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if patientId not known to responder', function (done) {
                request(app)
                    .get(routes.getDocumentDossierReq_patientIdNotKnown)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(404, 'Document Entry UUID not found', done);
            });
        });

        describe('/net.ihe/DocumentDossier/search', function () {
            it('returns 200 if Accept header undefined', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/json', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_json)
                    .expect('Content-Type', constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept */*', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_any)
                    .expect('Content-Type',  constants.mediaType_json)
                    .expect(200, done);
            });

            it('returns 200 if Accept application/xml+atom', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_atom)
                    .expect('Content-Type',  constants.mediaType_atom)
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_patientIdMissing)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_patientIdEmpty)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_patientIdMalformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "No Document Entries found" if patientId not known to responder', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_patientIdNotKnown)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(404, 'No Document Entries found', done);
            });

            it('returns 404 "No Document Entries found" if patient has no documents', function (done) {
                request(app)
                    .get(routes.findDocumentDossiersReq_patientIdNoDocuments)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(404, 'No Document Entries found', done);
            });
        });

        describe('/net.ihe/Document/', function () {
            it('returns 200', function (done) {
                request(app)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(200, done);
            });

            it('returns document if Accept header undefined', function (done) {
                request(app)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect('Content-Type', constants.mediaType_html + '; charset=utf-8')
                    .expect(200, done);
            });

            it('returns document if Accept */*', function (done) {
                request(app)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_any)
                    //.expect('Content-Type',  constants.mediaType_html + '; charset=utf-8')
                    .expect(200, done);
            });

            it('returns 415 "Unsupported media type" if Accept application/unsupported', function (done) {
                request(app)
                    .get(routes.getDocumentReq_wellformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .set('Accept', constants.mediaType_unsupported)
                    .expect(415, 'Unsupported media type', done);
            });

            it('returns 400 if uuid missing', function (done) {
                request(app)
                    .get(routes.getDocumentReq_uuidMissing)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if uuid malformed', function (done) {
                request(app)
                    .get(routes.getDocumentReq_uuidMalformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 404 "Document Entry UUID not found" if uuid not known to responder', function (done) {
                request(app)
                    .get(routes.getDocumentReq_uuidNotKnown)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(404, 'Document Entry UUID not found', done);
            });

            it('returns 400 if patientId missing', function (done) {
                request(app)
                    .get(routes.getDocumentReq_patientIdMissing)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId empty', function (done) {
                request(app)
                    .get(routes.getDocumentReq_patientIdEmpty)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });

            it('returns 400 if patientId malformed', function (done) {
                request(app)
                    .get(routes.getDocumentReq_patientIdMalformed)
                    .set('Authorization', encodeHttpBasicAuthorizationHeader(constants.goodUser, constants.goodPass))
                    .expect(400, 'Bad Request', done);
            });
        });
    });
});

function encodeHttpBasicAuthorizationHeader(user, pass){
    return "Basic " + b64.encode(user + ":" + pass);
}

