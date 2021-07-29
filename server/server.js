const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors')
const bodyParser = require('body-parser')
const lyricsFinder = require("lyrics-finder")
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log(refreshToken)
    
    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '8001af9b0d914927989f3c57f9af58c1',
        clientSecret : '38de2002feec45e683dc5aa4fc0719f7',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken : data.body.accessToken,
                expiresIn : data.body.expiresIn
            })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyAPI = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '8001af9b0d914927989f3c57f9af58c1',
        clientSecret : '38de2002feec45e683dc5aa4fc0719f7'
    })

    spotifyAPI
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

app.get('/lyrics', async (req,res) => {
    const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({lyrics})
})

app.listen(3001)

//this file is the server and creates a route '/login' that makes a request to the spotify api and returns an access & refresh token
// and expiresIn upon given a valid authorization code