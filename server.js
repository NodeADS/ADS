var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(8080, "127.0.0.1");

var PRODUCTS_FILE = path.join(__dirname, 'products.json');
var productsHelper = [];

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


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

var getProduct = function(id) {
  for (var i in productsHelper) {
    if (productsHelper[i].id == id) return productsHelper[i];
  }
  return undefined;
}

app.get('/api/products', function(req, res) {

});


io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('addProduct', function(newProduct) {
    addProduct(newProduct, function() {
      listProducts(function(products) {
        socket.emit('products', products);
      });
    });
  });

  socket.on('removeProduct', function() {
  });

  socket.on('products', function() {
    listProducts(function(products) {
      socket.emit('products', products);
    });
  });

  socket.on('processProduct', function(id) {
    var p = getProduct(id);

    if (p) {
      io.emit('processingProduct', p);

      setTimeout(function() {
        io.emit('productProcessed', p);
      }, p.time)
    }
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
