'use strict';

Object.defineProperty(exports, "__esModule", {
            value: true
});
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGOLAB_USER + ':' + process.env.MONGOLAB_PASS + '@ds055925.mongolab.com:55925/fccdev');

var SearchSchema = new mongoose.Schema({
            searchTerm: String,
            timeSearched: { type: Date, default: Date.now }
});

exports.default = mongoose.model('SearchModel', SearchSchema);
//# sourceMappingURL=search_model.js.map