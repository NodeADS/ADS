import React from 'react';
import { CollectionItem, Button } from 'react-materialize';

class ProductItem extends React.Component {
  constructor(props) {
    super(props);

    

  }

  render() {
    return (
      <CollectionItem>
        {this.props.product.name}
        <Button waves='light' className='right-align'>Processar</Button>
      </CollectionItem>
    );
  }
}

export default ProductItem;
