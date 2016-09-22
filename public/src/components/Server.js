import React from 'react';
import Qajax from 'qajax';
import { ProgressBar } from 'react-materialize';

class Server extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Parado',
      collor: 'red-text',
      showProgress: false,
      progress: 0
    }
    this.interval;
  }

  componentDidMount() {
    Qajax({ url: '/api/server/status', params: { id: this.props.server.id } })
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((data) => {
        if (data.item) {
          let intervalTime = 100
             , initDate = new Date(data.item.startDate)
             , delay = data.item.delay * 1000;

          this.setState({
            status: `Processando ${data.item.name}`,
            collor: 'green-text',
            showProgress: true,
            progress: ((new Date() - initDate) / delay) * 100
          });

          this.interval = setInterval(() => {
            let completed = new Date() - initDate;
            this.setState({ progress: (completed / delay) * 100 });
          }, intervalTime);
        }

      }, function (err) {
        console.log(err);
      });

    this.props.socket.on('serverIdle', (server) => {
      if (server.id != this.props.server.id) return;

      clearInterval(this.interval);
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

      clearInterval(this.interval);
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
        showProgress: false,
        progress: 0
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
