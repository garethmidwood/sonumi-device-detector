var config = require('config'),
    sonumiLogger = require('sonumi-logger'),
    defaultNetworkAdapter = require('./adapter/lan');

var logger,
    networkAdapter;

function Detector(adapters)
{
    adapters = typeof adapters !== 'undefined' ? adapters : {};

    networkAdapter = adapters.hasOwnProperty('network')
        ? adapters['network']
        : new defaultNetworkAdapter();

    var logDirectory = config.logging.logDir;
    logger = sonumiLogger.init(logDirectory);
    logger.addLogFile('info', logDirectory + '/device-detector-info.log', 'info');
    logger.addLogFile('errors', logDirectory + '/device-detector-error.log', 'error');
}

Detector.prototype = {
    devices: [],
    scan: function() {
        logger.log('scanning for devices');

        this.devices = networkAdapter.scan();
    }
};

module.exports = Detector;