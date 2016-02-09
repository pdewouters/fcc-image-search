'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://' + process.env.MONGOLAB_USER + ':' + process.env.MONGOLAB_PASS + '@ds055925.mongolab.com:55925/fccdev')


const SearchSchema = new mongoose.Schema({
            searchTerm: String,
            timeSearched: { type: Date, default: Date.now }
})

export default mongoose.model('SearchModel', SearchSchema)
