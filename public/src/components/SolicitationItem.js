import React from 'react';
import { CollectionItem, Button } from 'react-materialize';

class SolicitationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Parado',
      collor: 'red-text'
    };

    this.props.socket.on('processItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Processando...',
        collor: 'orange-text'
      });
    });

    this.props.socket.on('completedItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Completo',
        collor: 'green-text'
      });
    });

    this.props.socket.on('addQueueItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Parado',
        collor: 'red-text'
      });
    });

    this.props.socket.on('removeQueueItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Parado',
        collor: 'orange-text'
      });
    });

    this.processSolicitation = this.processSolicitation.bind(this);
  }

  processSolicitation() {
    //this.props.socket.emit('processSolicitation', this.props.product.id);
  }

  render() {
    return (
      <CollectionItem>
        <h6>{this.props.solicitation.name}</h6>
        <span className={this.state.collor + ' small'}>{this.state.status}</span>
      </CollectionItem>
    );
  }
}

export default SolicitationItem;
