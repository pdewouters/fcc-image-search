'use strict';

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _search_model = require('./inc/search_model');

var _search_model2 = _interopRequireDefault(_search_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express2.default)();
app.set('port', process.env.PORT || 5000);

app.get('/', function (req, res) {
    res.send('FCC Image Search');
});

// /api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search(*)/\?*', function (req, res) {

    var search = new _search_model2.default({ searchTerm: req.params.search });
    search.save(function (err, entry) {
        if (err) console.log(err);
    });

    var options = {
        url: 'https://api.imgur.com/3/gallery/search/?q=' + _querystring2.default.escape(req.params.search) + '&' + _querystring2.default.stringify(req.query),
        headers: { 'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_KEY }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info.data.map(function (result) {
                return _lodash2.default.pick(result, ['title', 'link']);
            }));
        }
    }
    (0, _request2.default)(options, callback);
});

app.get('/api/latest/imagesearch', function (req, res) {
    res.header("Content-Type", "application/json");
    _search_model2.default.find({}, function (err, docs) {
        if (err) console.log(err);
        res.send(docs.map(function (doc) {
            return _lodash2.default.pick(doc, ['searchTerm', 'timeSearched']);
        }));
    });
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