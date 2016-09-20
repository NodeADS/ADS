import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import Socket from './Socket';
import Solicitation from './Solicitation';

var SOLICITATIONS_FILE = path.join(__dirname, '../solicitations.json');
var app = express();
var solicitation = new Solicitation(fs, SOLICITATIONS_FILE);
var socket = new Socket(app, http, solicitation);



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

/*
var listProducts = function(callback) {
  fs.readFile(PRODUCTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var temp = JSON.parse(data);
    productsHelper = temp;
    callback(temp);
    //res.json(JSON.parse(data));
  });
};

var addProduct = function(newProduct, callback) {
  fs.readFile(PRODUCTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var products = JSON.parse(data);
    newProduct.id = Date.now();
    products.push(newProduct);
    productsHelper = products;
    fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      callback();
    });
  });
}

app.get('/api/products', function(req, res) {

});
*/

socket.start();

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
