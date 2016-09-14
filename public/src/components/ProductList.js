import React from 'react';
import { Collection, CollectionItem, Button } from 'react-materialize';
//import ProductItem from './ProductItem';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };

    var self = this;
    this.props.socket.emit('products');
    this.props.socket.on('products', function(data){
      self.setState({products: data});
    });

    this.processProduct = this.processProduct.bind(this);
  }

  processProduct(id) {
    return () => {
      this.props.socket.emit('processProduct', id);

    };
  }

  render() {
    var self = this;
    var productNodes = this.state.products.map(function(product) {
      return (
        <CollectionItem key={product.id}>
          {product.name}
          <Button waves='light' className='right-align' onClick={self.processProduct(product.id)}>Processar</Button>
        </CollectionItem>
      );
    });
    return (
      <Collection header='Produtos'>
        {productNodes}
      </Collection>
    );
  }
}

export default ProductList;
