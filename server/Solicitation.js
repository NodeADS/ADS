class Solicitation {
  constructor(fs, SOLICITATIONS_FILE) {
    var self = this;
    this.itens = [];
    this.fs = fs;
    this.SOLICITATIONS_FILE = SOLICITATIONS_FILE;

    this.getAsync((data) => {
      self.itens = data;
    });
  }

  get() {
    return this.itens;
  }

  getAsync(callback) {
    this.fs.readFile(this.SOLICITATIONS_FILE, function(err, data) {
      if (err) {
        console.error0('Product', 'getAsync', err);
        return;
      }
      var temp = JSON.parse(data);
      callback(temp);
    });
  }

  set() {
    return;
    this.fs.readFile(this.SOLICITATIONS_FILE, function(err, data) {
      if (err) {

        return;
      }
      var products = JSON.parse(data);
      newProduct.id = Date.now();
      products.push(newProduct);
      productsHelper = products;
      fs.writeFile(SOLICITATIONS_FILE, JSON.stringify(products, null, 2), function(err) {
        if (err) {
          console.error0('Product', 'set', err);
          return;
        }
        callback();
      });
    });
  }
}

export default Solicitation;
