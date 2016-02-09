'use strict'
require('dotenv').config();
import https from 'https'
import express from 'express'
import querystring from 'querystring'
import request from 'request'
import _ from 'lodash'
import SearchModel from './inc/search_model'

const app = express()
app.set('port', (process.env.PORT || 5000))

app.get('/', (req, res) => {
    res.send('FCC Image Search')
})

// /api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search(*)/\?*', (req, res) => {

    let search = new SearchModel({searchTerm: req.params.search})
    search.save((err,entry) => {
        if (err) console.log(err)
    })
    
    const options = {
        url: 'https://api.imgur.com/3/gallery/search/?q=' + querystring.escape(req.params.search) + '&' +  querystring.stringify(req.query),
        headers: {'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_KEY}
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info.data.map(result => {
                return _.pick(result, ['title','link'])
            }))
        }
    }
    request(options,callback)
})

app.get('/api/latest/imagesearch', (req, res) => {
    res.header("Content-Type", "application/json")
    SearchModel.find({},(err, docs)=>{
        if(err) console.log(err)
        res.send(docs.map(doc => {
            return _.pick(doc,['searchTerm','timeSearched'])
        }))
    })

})

// Fallback
app.get('/*', (req, res) => {
    res.header("Content-Type", "application/json")
    res.send(JSON.stringify({'error':'invalid route'}))
})

const getSiteUrl = request => {
    return request.protocol + '://' + request.get('Host') + '/'
}

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})