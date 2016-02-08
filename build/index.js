'use strict';

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
app.set('port', process.env.PORT || 5000);

app.get('/', function (req, res) {
    res.send('FCC Image Search');
});

// /api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search(*)/\?*', function (req, res) {
    console.log(req.params.search);
    console.log(req.query);
    var options = {
        url: 'https://api.imgur.com/3/gallery/search/?q=' + _querystring2.default.escape(req.params.search) + '&' + _querystring2.default.stringify(req.query),
        headers: { 'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_KEY }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info);
        }
    }
    (0, _request2.default)(options, callback);
});

// Fallback
app.get('/*', function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ 'error': 'invalid route' }));
});

var getSiteUrl = function getSiteUrl(request) {
    return request.protocol + '://' + request.get('Host') + '/';
};

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
//# sourceMappingURL=index.js.map