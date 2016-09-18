import React from 'react';
import { Collection, CollectionItem } from 'react-materialize';

class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    var self = this;
    this.state = {
      status: 'Parado',
      collor: 'red-text'
    };

    this.props.socket.on('startServer', (data) => {
      this.setState({
        status: 'Aguardando solicitação',
        collor: 'green-text'
      });
    });

    this.props.socket.on('stopedtServer', (data) => {
      this.setState({
        status: 'Parado',
        collor: 'red-text'
      });
    });

    this.props.socket.on('processItem', (item) => {
      this.setState({
        status: `Processando ${item.name}`,
        collor: 'green-text'
      });
    });

    this.props.socket.on('completedItem', (item) => {
      this.setState({
        status: `${item.name} processada`,
        collor: 'green-text'
      });
    });

  }

  render() {
    return (
      <Collection header='Atendimento'>
        <CollectionItem key={1}>
          <h6>Servidor 1</h6>
          <span className={this.state.collor + ' small'}>{this.state.status}</span>
        </CollectionItem>
      </Collection>
    );
  }
}

export default ServerStatus;
