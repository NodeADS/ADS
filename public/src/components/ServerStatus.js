import React from 'react';
import Qajax from 'qajax';
import { Collection, CollectionItem, ProgressBar } from 'react-materialize';


class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Parado',
      collor: 'red-text',
      showProgress: false,
      progress: 0
    };
  }

  componentDidMount() {
    this.interval = undefined;

    this.props.socket.emit('serverStatus');
    this.props.socket.on('serverStatus', (data) => {
      let status = 'Parado'
        , collor = 'red-text'
        , showProgress = false;

      if (data.on) {
        status = 'Aguardando solicitação';
        collor = 'green-text';
        if (data.processingItem) {
          let intervalTime = 100
             , initDate = new Date(data.processingItem.startDate)
             , delay = data.processingItem.delay * 1000;

          status = `Processando ${data.processingItem.name}`;
          showProgress = true;

          this.interval = setInterval(() => {
            let completed = new Date() - initDate;
            this.setState({ progress: (completed / delay) * 100 });
          }, intervalTime);

        }
      }

      this.setState({
        status: status,
        collor: collor,
        showProgress: showProgress
      });
    });

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

      this.interval = setInterval(() => {
        progress += sum;
        this.setState({ progress: progress });
      }, intervalTime);
    });

    this.props.socket.on('completedItem', (item) => {
      this.setState({
        status: `${item.name} processada`,
        collor: 'green-text',
        showProgress: true,
        progress: 100
      });
      clearInterval(this.interval);
    });

  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
