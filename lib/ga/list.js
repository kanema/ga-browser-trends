var https = require('https');

module.exports = function(cb) {
    var self = this;
    var data_url = "/analytics/v3/management/accounts/~all/webproperties/~all/profiles";

    var get_options = {
        host: 'www.googleapis.com',
        port: 443,
        path: data_url,
        method: 'GET',
        headers: {
            Authorization: self.tokenType + " " + self.token,
            "GData-Version": 2
        }
    };

    var combineChunks = function(chunks, length) {
        var buf = new Buffer(length);
        var off = 0;
        for (var i = 0; i < chunks.length; i++) {
            var chunk = chunks[i];
            chunk.copy(buf, off, 0);
            off += chunk.length;
        }
        return buf;
    };

    var req = https.request(get_options, function(res) {
        var chunks = [];
        var length = 0;
        res.on('data', function(chunk) {
            chunks.push(chunk);
            length += chunk.length;
        });
        res.on('end', function() {
            var data_data = combineChunks(chunks, length).toString();
            var parsed_data = JSON.parse(data_data);
            if (parsed_data.error) {
                var err = new Error(parsed_data.error.message);
                if (typeof cb === 'function') {
                    return cb(err);
                }
            }

            cb(false, parsed_data);
        });
    });
    req.end();
};