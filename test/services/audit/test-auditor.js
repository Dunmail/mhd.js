var audit = require('../../../lib/services/audit/audit.js');
var dependable = require('dependable');
var Resolver = require('../../../lib/services/resolver.js').Resolver;
var AuditRecordWriter = require('./stub-auditRecordWriter.js').AuditRecordWriter;

var assert = require('assert');
var check = require('validator').check;
var sinon = require('sinon');
var constants = require('../../config/constants.js');

describe('Auditor', function () {
    var writer = new AuditRecordWriter();
    var writer_write_spy;

    beforeEach(function () {
        var resolver = new Resolver();
        resolver.container = dependable.container();
        resolver.container.register('auditRecordWriter', writer);

        writer_write_spy = sinon.spy(writer, 'write');
    });

    afterEach(function () {
        writer.write.restore();
    });

    describe('new()', function () {
        it('returns instance of Auditor', function () {
            var subject = new audit.Auditor();
            check(subject).notNull();
            assert(subject instanceof audit.Auditor);
        });
    });

    describe('notify()', function () {
        var subject = new audit.Auditor();

        it('calls registered auditRecordWriter.write', function (done) {
            subject.notify('http://foo', '192.168.0.1', 'mocha', audit.OUTCOME_SUCCESS, function (err) {
                check(err).notNull();
                assert(writer_write_spy.calledOnce);
                done();
            });
        });

        it('returns error when url undefined', function (done) {
            subject.notify(null, '192.168.0.1', 'mocha', audit.OUTCOME_SUCCESS, function (err) {
                check(err).notNull();
                check(writer_write_spy.callCount).is(0);
                done();
            });
        });

        it('returns error when ip undefined', function (done) {
            subject.notify('http://foo', null, 'mocha', audit.OUTCOME_SUCCESS, function (err) {
                check(err).notNull();
                check(writer_write_spy.callCount).is(0);
                done();
            });
        });

        it('returns error when user undefined', function (done) {
            subject.notify('http://foo', '192.168.0.1', null, audit.OUTCOME_SUCCESS, function (err) {
                check(err).notNull();
                check(writer_write_spy.callCount).is(0);
                done();
            });
        });

        it('returns error when outcome undefined', function (done) {
            subject.notify('http://foo', '192.168.0.1', 'mocha', null, function (err) {
                check(err).notNull();
                check(writer_write_spy.callCount).is(0);
                done();
            });
        });

        it('throws exception when callback undefined', function (done) {
            try {
                subject.notify('http://foo', '192.168.0.1', 'mocha', audit.OUTCOME_SUCCESS, null);
                assert(false);
            }
            catch (ex) {
                check(ex).notNull();
                check(writer_write_spy.callCount).is(0);
                done();
            }
        });
    });

    describe('notify()', function () {
        var resolver = new Resolver();
        resolver.container = dependable.container();

        var subject = new audit.Auditor();

        it('returns error when no auditRecordWriter service is registered', function (done) {
            subject.notify('http://foo', '192.168.0.1', 'mocha', audit.OUTCOME_SUCCESS, function (err) {
                check(err).notNull();
                done();
            });
        });
    });
});