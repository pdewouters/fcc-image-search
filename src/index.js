'use strict'
require('dotenv').config();
import https from 'https'
import express from 'express'
import querystring from 'querystring'
import concat from 'concat-stream'
import request from 'request'
const app = express()
app.set('port', (process.env.PORT || 5000))

app.get('/', (req, res) => {
    res.send('FCC Image Search')
})

// /api/imagesearch/lolcats%20funny?offset=10
app.get('/api/imagesearch/:search(*)/\?*', (req, res) => {
   // console.log(req.params.search)
   // console.log(req.query)
    const options = {
        url: 'https://api.imgur.com/3/gallery/search/?q=' + querystring.escape(req.params.search) + '&' +  querystring.stringify(req.query),
        headers: {'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_KEY}
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            res.send(info)
        }
    }
    request(options,callback)
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