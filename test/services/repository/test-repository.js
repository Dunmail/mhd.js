var repository = require('../../../lib/services/repository/repository.js');
var dependable = require('dependable');
var Resolver = require('../../../lib/services/resolver.js').Resolver;
var RepositoryAdapter = require('./stub-repositoryAdapter.js').RepositoryAdapter;

var assert = require('assert');
var check = require('validator').check;
var sinon = require('sinon');
var constants = require('../../config/constants.js');
var responses = require('../../config/responses.js');

describe('Repository', function () {
    var adapter = new RepositoryAdapter();

    beforeEach(function () {
        var resolver = new Resolver();
        resolver.container = dependable.container();
        resolver.container.register('repositoryAdapter', adapter);
    });

    describe('new()', function () {
        it('returns instance of Repository', function () {
            var subject = new repository.Repository();
            check(subject).notNull();
            assert(subject instanceof repository.Repository);
        });
    });

    describe('getPatientIdPattern()', function () {
        it('returns regex pattern for patientId', function () {
            var subject = new repository.Repository();
            check(subject).notNull();
            check(subject.getPatientIdPattern()).equals(constants.patientIdPattern_test);
        });
    });

    describe('getDocumentDossier() [ITI-66]', function () {
        var subject = new repository.Repository();
        var spy;

        beforeEach(function () {
            spy = sinon.spy(adapter, 'getDocumentDossier');
        });

        afterEach(function () {
            adapter.getDocumentDossier.restore();
        });

        it('calls registered repositoryAdapter.getDocumentDossier', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).isNull();
                check(res).notNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns json document dossier if format undefined', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_undefined, function (err, res) {
                check(res).notNull();
                check(res).equals(JSON.stringify(responses.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId)));
                assert(spy.calledOnce);
                done();
            });
        });


        it('returns json document dossier if format application/json', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(res).notNull();
                check(res).equals(JSON.stringify(responses.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId)));
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns json document dossier if format */*', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_any, function (err, res) {
                check(res).notNull();
                check(res).equals(JSON.stringify(responses.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId)));
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unsupported media type" if format application/xml+atom', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_atom, function (err, res) {
                check(err).is('Unsupported media type');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unsupported media type" if format application/unsupported', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_unsupported, function (err, res) {
                check(err).is('Unsupported media type');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unknown Document UUID" if document not found', function (done) {
            subject.getDocumentDossier(constants.unknownDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Unknown Document UUID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unknown PatientID" if patient not known', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.unknownPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Unknown PatientID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Deprecated Document UUID" if document deprecated', function (done) {
            subject.getDocumentDossier(constants.deprecatedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Deprecated Document UUID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });
    });

    describe('getDocumentDossier() [ITI-66]', function () {
        var subject = new repository.Repository();
        var container_old;
        var spy;

        beforeEach(function () {
            var resolver = new Resolver();
            container_old = resolver.container;
            resolver.container = dependable.container();

            spy = sinon.spy(adapter, 'getDocumentDossier');
        });

        afterEach(function () {
            var resolver = new Resolver();
            resolver.container = container_old;

            adapter.getDocumentDossier.restore();
        });

        it('returns err when no repositoryAdapter service is registered', function (done) {
            subject.getDocumentDossier(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).notNull();
                check(res).isNull();
                check(spy.callCount).is(0);
                done();
            });
        });
    });

    describe('findDocumentDossiers() [ITI-67]', function () {
        var subject = new repository.Repository();
        var spy;

        beforeEach(function () {
            spy = sinon.spy(adapter, 'findDocumentDossiers');
        });

        afterEach(function () {
            adapter.findDocumentDossiers.restore();
        });

        it('calls registered repositoryAdapter.findDocumentDossiers', function (done) {
            var params = {
                originalUrl:"http://dummy:888/",
                query:{ PatientID:constants.wellformedPatientId}
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).isNull();
                check(res).notNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns json document dossiers', function (done) {
            var params = {
                originalUrl:"http://dummy:888/",
                query:{ PatientID:constants.wellformedPatientId}
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).isNull();
                check(res).equals(JSON.stringify(responses.findDocumentDossiers(params.query, params.format)));
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unknown PatientID" if patient not known', function (done) {
            var params = {
                query:{ PatientID:constants.unknownPatientId}
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).is('Unknown PatientID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "No Document Entries found" if patient has no documents', function (done) {
            var params = {
                originalUrl:"http://dummy:888/",
                query:{ PatientID:constants.noDocumentsPatientId}
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).is('No Document Entries found');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unsupported media type" if media type not supported', function (done) {
            var params = {
                originalUrl:"http://dummy:888/",
                query:{ PatientID:constants.wellformedPatientId},
                format:constants.mediaType_unsupported
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).is('Unsupported media type');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });
    });

    describe('findDocumentDossiers() [ITI-67]', function () {
        var subject = new repository.Repository();
        var container_old;
        var spy;

        beforeEach(function () {
            var resolver = new Resolver();
            container_old = resolver.container;
            resolver.container = dependable.container();

            spy = sinon.spy(adapter, 'findDocumentDossiers');
        });

        afterEach(function () {
            var resolver = new Resolver();
            resolver.container = container_old;
            adapter.findDocumentDossiers.restore();
        });

        it('returns err when no repositoryAdapter service is registered', function (done) {
            var params = {
                originalUrl:"http://dummy:888/",
                query:{ PatientID:constants.noDocumentsPatientId}
            };
            subject.findDocumentDossiers(params.query, params.format, function (err, res) {
                check(err).notNull();
                check(res).isNull();
                check(spy.callCount).is(0);
                done();
            });
        });
    });

    describe('getDocument() [ITI-68]', function () {
        var subject = new repository.Repository();
        var spy;

        beforeEach(function () {
            spy = sinon.spy(adapter, 'getDocument');
        });

        afterEach(function () {
            adapter.getDocument.restore();
        });

        it('calls registered repositoryAdapter.getDocument', function (done) {
            subject.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).isNull();
                check(res).notNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns document if format undefined', function (done) {
            subject.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_undefined, function (err, res) {
                check(res).notNull();
                check(res.headers).equals(responses.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId).headers);
                check(res.data).equals(responses.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId).data);
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unsupported media type" if format application/unsupported', function (done) {
            subject.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_unsupported, function (err, res) {
                check(err).is('Unsupported media type');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unknown Document UUID" if document not found', function (done) {
            subject.getDocument(constants.unknownDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Unknown Document UUID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Unknown PatientID" if patient not known', function (done) {
            subject.getDocument(constants.wellformedDocumentUuid, constants.unknownPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Unknown PatientID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });

        it('returns err "Deprecated Document UUID" if document deprecated', function (done) {
            subject.getDocument(constants.deprecatedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).is('Deprecated Document UUID');
                check(res).isNull();
                assert(spy.calledOnce);
                done();
            });
        });
    });

    describe('getDocument() [ITI-68]', function () {
        var subject = new repository.Repository();
        var container_old;
        var spy;

        beforeEach(function () {
            var resolver = new Resolver();
            container_old = resolver.container;
            resolver.container = dependable.container();

            spy = sinon.spy(adapter, 'getDocumentDossier');
        });

        afterEach(function () {
            var resolver = new Resolver();
            resolver.container = container_old;

            adapter.getDocumentDossier.restore();
        });

        it('returns err when no repositoryAdapter service is registered', function (done) {
            subject.getDocument(constants.wellformedDocumentUuid, constants.wellformedPatientId, constants.mediaType_json, function (err, res) {
                check(err).notNull();
                check(res).isNull();
                check(spy.callCount).is(0);
                done();
            });
        });
    });

});