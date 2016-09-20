import React from 'react';
import { Collection } from 'react-materialize';
import SolicitationItem from './SolicitationItem';

class SolicitationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };

    var self = this;
    this.props.socket.emit('solicitations');
    this.props.socket.on('solicitations', function(data){
      self.setState({products: data});
    });
  }

  render() {
    var self = this;
    var productNodes = this.state.products.map(function(product) {
      return (
        <SolicitationItem key={product.id} product={product} socket={self.props.socket} />
      );
    });
    return (
      <Collection header='Solicitações'>
        {productNodes}</CollectionItem>
      </Collection>
    );
  }
}

export default SolicitationList;
