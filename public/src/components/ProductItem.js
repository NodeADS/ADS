import React from 'react';
import { CollectionItem, Button } from 'react-materialize';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);

    this.processProduct = this.processProduct.bind(this);
  }

  processProduct(id) {
    this.props.socket.emit('processProduct', this.props.product.id);
  }

  render() {
    return (
      <CollectionItem >
        {this.props.product.name}
        <Button waves='light' onClick={this.processProduct}>Processar</Button>
      </CollectionItem>
    );
  }
}

export default ProductItem;
