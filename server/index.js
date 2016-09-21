import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import Socket from './Socket';
import Solicitation from './Solicitation';
import API from './API';
import Process from './Process';

var SOLICITATIONS_FILE = path.join(__dirname, '../solicitations.json');
var app = express();
var solicitation = new Solicitation(fs, SOLICITATIONS_FILE);
var processManager = new Process();
var socket = new Socket(app, http, solicitation, processManager);

new API(app, processManager);

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use((req, res, next) => {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

socket.start();

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
