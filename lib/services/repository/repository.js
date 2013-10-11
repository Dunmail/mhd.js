var Resolver = require('../resolver.js').Resolver;
var assert = require('assert');
var check = require('validator').check;

function Repository() {
}

Repository.prototype = {
    constructor:Repository,
    getPatientIdPattern:function () {

        var adapter = this.getAdapter();
        var pattern = adapter.patientIdPattern;

        postconditions(pattern);
        return pattern;

        function postconditions(pattern) {
            check(pattern).notNull();
        }
    },
    getDocumentDossier:function (entryUuid, patientId, format, callback) {
        try {
            preconditions(entryUuid, patientId, format, callback);

            var adapter = this.getAdapter();
            adapter.getDocumentDossier(entryUuid, patientId, format, callback);
        }
        catch (ex) {
            callback(ex);
        }

        function preconditions(entryUuid, patientId, format, callback) {
            check(entryUuid).notNull();
            check(patientId).notNull();
            check(callback).notNull();
        }
    },
    findDocumentDossiers:function (query, format, callback) {
        try {
            preconditions(query, format, callback);

            var adapter = this.getAdapter();
            adapter.findDocumentDossiers(query, format, callback);
        }
        catch (ex) {
            callback(ex);
        }

        function preconditions(query, format, callback) {
            check(query).notNull();
            check(callback).notNull();
        }
    },
    getDocument:function (entryUuid, patientId, format, callback) {
        try {
            preconditions(entryUuid, patientId, format, callback);

            var adapter = this.getAdapter();
            adapter.getDocument(entryUuid, patientId, format, callback);
        }
        catch (ex) {
            callback(ex);
        }

        function preconditions(entryUuid, patientId, format, callback) {
            check(entryUuid).notNull();
            check(patientId).notNull();
            check(callback).notNull();
        }
    },
    getAdapter:function () {
        var resolver = new Resolver();
        var adapter = resolver.container.get('repositoryAdapter');

        postconditions(adapter);
        return adapter;

        function postconditions(adapter) {
            check(adapter).notNull();
            check(adapter.getDocumentDossier).notNull();
            check(adapter.findDocumentDossiers).notNull();
        }
    }
}

exports.Repository = Repository;