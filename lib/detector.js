var config = require('config'),
    sonumiLogger = require('sonumi-logger'),
    defaultNetworkAdapter = require('./adapter/lan');

var logger,
    networkAdapter;

function Detector(adapters)
{
    adapters = typeof adapters !== 'undefined' ? adapters : {};

    var logDirectory = config.logging.logDir;
    logger = sonumiLogger.init(logDirectory);
    logger.addLogFile('info', logDirectory + '/device-detector-info.log', 'info');
    logger.addLogFile('errors', logDirectory + '/device-detector-error.log', 'error');

    networkAdapter = adapters.hasOwnProperty('network')
        ? adapters['network']
        : new defaultNetworkAdapter(logger);
}

Detector.prototype = {
    devices: [],
    scan: function() {
        logger.log('scanning for devices');

        var self = this;

        return new Promise(function(resolve, reject) {
            networkAdapter.scan().then(
                function (devices) {
                    self.devices = devices;
                    resolve();
                },
                function () {
                    reject();
                }
            );
        });
    }
};

module.exports = Detector;