import React from 'react';
import { CollectionItem, Button } from 'react-materialize';

class SolicitationItem extends React.Component {
  constructor(props) {
    super(props);

    this.processSolicitation = this.processSolicitation.bind(this);
  }

  processSolicitation(id) {
    this.props.socket.emit('processSolicitation', this.props.product.id);
  }

  render() {
    return (
      <CollectionItem >
        {this.props.product.name}
        <Button waves='light' onClick={this.processSolicitation}>Processar</Button>
      </CollectionItem>
    );
  }
}

export default SolicitationItem;
