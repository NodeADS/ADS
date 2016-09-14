import React from 'react';
import CreateProduct from './CreateProduct';
import ProductList from './ProductList';

class ProductBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CreateProduct socket={this.props.socket} />
        <ProductList socket={this.props.socket} />
      </div>
    );
  }
}

export default ProductBox;
