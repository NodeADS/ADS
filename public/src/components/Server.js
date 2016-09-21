import React from 'react';
import Qajax from 'qajax';
import { ProgressBar } from 'react-materialize';

class Server extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Parado',
      collor: 'red-text',
      showProgress: true,
      progress: 0
    }
    this.interval;
  }

  componentDidMount() {

    /*Qajax('/api/')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((data) => {

      }, function (err) {
        console.log(err);
      });*/
    this.props.socket.on('serverIdle', (server) => {
      if (server.id != this.props.server.id) return;
      this.setState({
        status: 'Aguardando solicitação',
        collor: 'green-text',
        showProgress: false
      });
    });

    this.props.socket.on('serverProcessingItem', (server, item) => {
      if (server.id != this.props.server.id) return;
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

    this.props.socket.on('serverProcessedItem', (server, item) => {
      if (server.id != this.props.server.id) return;
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
      <div>
        <h6>{this.props.server.name}</h6>
        <span className={this.state.collor + ' small'}>{this.state.status}</span>
        { this.state.showProgress ? <ProgressBar progress={this.state.progress} /> : null }
      </div>
    )
  }
}

export default Server;
