import React from 'react';
import { Collection } from 'react-materialize';
import ProductItem from './ProductItem';

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
  }

  render() {
    var self = this;
    var productNodes = this.state.products.map(function(product) {
      return (
        <ProductItem key={product.id} product={product} socket={self.props.socket} />
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
