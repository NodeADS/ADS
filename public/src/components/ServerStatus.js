import React from 'react';
import { Collection, CollectionItem, ProgressBar } from 'react-materialize';

class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    let interval;
    this.state = {
      status: 'Parado',
      collor: 'red-text',
      showProgress: false,
      progress: 0
    };

    this.props.socket.on('startServer', (data) => {
      this.setState({
        status: 'Aguardando solicitação',
        collor: 'green-text',
        showProgress: false
      });
    });

    this.props.socket.on('stopedtServer', (data) => {
      this.setState({
        status: 'Parado',
        collor: 'red-text',
        showProgress: false
      });
    });

    this.props.socket.on('processItem', (item) => {
      let intervalTime = 100
         , sum = (intervalTime / (item.delay * 1000)) * 100
         , progress = 0;

      this.setState({
        status: `Processando ${item.name}`,
        collor: 'green-text',
        showProgress: true
      });

      interval = setInterval(() => {
        progress += sum;
        this.setState({ progress: progress });
      }, intervalTime);
    });

    this.props.socket.on('completedItem', (item) => {
      this.setState({
        status: `${item.name} processada`,
        collor: 'green-text',
        showProgress: true
      });
      clearInterval(interval);
    });

  }

  render() {
    return (
      <Collection header='Atendimento'>
        <CollectionItem key={1}>
          <h6>Servidor 1</h6>
          <span className={this.state.collor + ' small'}>{this.state.status}</span>
          { this.state.showProgress ? <ProgressBar progress={this.state.progress} /> : null }
        </CollectionItem>
      </Collection>
    );
  }
}

export default ServerStatus;
