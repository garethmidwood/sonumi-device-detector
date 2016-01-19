'use strict';

var ping = require('net-ping'),
    network = require('network');

var pingSession,
    logger,
    connectedDevices = [];

function lanAdapter(loggerObj) {
    logger = loggerObj;

    var options = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 16,
        retries: 1,
        sessionId: (process.pid % 65535),
        timeout: 10000,
        ttl: 128
    };

    pingSession = ping.createSession(options);
}

function getSubnet() {
    return new Promise(function(resolve, reject) {
        logger.log('getting active network interface');

        network.get_active_interface(function(err, obj) {
            if (err) {
                reject(err);
            }

            resolve(obj);
        });
    });
}

lanAdapter.prototype = {
    scan: function () {
        var self = this;

        return new Promise(function(resolve, reject) {
            getSubnet().then(
                function (networkDetails) {
                    self.performScan(networkDetails.ip_address).then(
                        function () {
                            logger.log('scan complete, devices found:');
                            logger.log(connectedDevices);
                            resolve(connectedDevices);
                        },
                        function () {
                            logger.log('scan failed');
                            resolve(connectedDevices);
                        }
                    );
                },
                function () {
                    logger.error('could not get active subnet, exiting');
                    reject('could not get subnet');
                }
            );
        });
    },
    performScan: function(networkIp) {
        logger.log('performing scan');

        var parts = networkIp.split('.');
        var ipSubnet = '';
        var lastIndex = parts.length - 1;
        for(var j = 0; j < lastIndex; j++) {
            ipSubnet += parts[j] + '.';
        }

        logger.log('scanning from ' + ipSubnet + '0 to ' + ipSubnet + '255');

        connectedDevices = [];
        var promises = [];

        for (var target = 0; target < 255; target++) {
            var targetIp = ipSubnet + target;

            promises.push(promise);

            var promise = new Promise(function(resolve, reject) {
                pingSession.pingHost(targetIp, function (error, respondingIp) {
                    if (error) {
                        resolve('no device found');
                    } else {
                        connectedDevices.push(respondingIp);
                        resolve('device found');
                    }
                });
            });
        }

        return Promise.all(promises);
    }
};

module.exports = lanAdapter;