var chai   = require('chai'),
    sinon  = require('sinon'),
    rewire = require('rewire');

var expect = chai.expect;
var assert = chai.assert;


describe("It scans for devices", function() {
    var detector,
        loggerMock,
        sonumiLoggerMock,
        networkAdapterMock;
    var deviceDetector = rewire("../lib/detector");

    beforeEach(function() {
        loggerMock = sinon.stub();
        loggerMock.log = sinon.stub();
        loggerMock.addLogFile = sinon.stub();
        sonumiLoggerMock = sinon.stub();
        sonumiLoggerMock.init = sinon.stub().returns(loggerMock);
        networkAdapterMock = sinon.stub();
        networkAdapterMock.scan = sinon.spy();

        configMock = {
            "logging": {
                "logDir": "/tmp/"
            }
        };

        deviceDetector.__set__({
            config: configMock,
            logger: loggerMock,
            sonumiLogger: sonumiLoggerMock
        });

        detector = new deviceDetector({ network: networkAdapterMock });
    });

    it('should retrieve a list of connected devices from the network adapter', function() {
        detector.scan();

        assert(networkAdapterMock.scan.calledOnce);
    });
});
