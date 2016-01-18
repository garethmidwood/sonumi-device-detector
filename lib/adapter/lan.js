'use strict';

var ping = require('net-ping');

var pingSession;

function lanAdapter() {
    pingSession = ping.createSession();
}

lanAdapter.prototype = {
    scan: function () {
        var devices = [];

        for (var target = 0; target <= 255; target++) {
            /*
             *  TODO: it is not safe to assume that we are always on the 192.168.0 subnet
             */
            var targetIp = '192.168.0.' + target;

            pingSession.pingHost(targetIp, function (error, targetIp) {
                if (error) {
                    console.log (targetIp + ": " + error.toString ());
                } else {
                    devices.push(targetIp);
                    console.log (targetIp + ": Alive");
                }
            });
        }

        return devices;
    }
};

module.exports = lanAdapter;