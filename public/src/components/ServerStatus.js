import React from 'react';
import { ProgressBar } from 'react-materialize';

class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    var self = this
      , interval;
    this.state = {
      status: 'Aguardando...',
      name: '',
      statusBar: 0
    };

    this.props.socket.on('processingProduct', function(data) {
      var intervalTime = 100
        , sum = (intervalTime / data.time) * 100;

      self.setState({
        status: 'Processando',
        name: data.name,
        statusBar: 0
      });

      interval = setInterval(function () {
        self.setState({ statusBar: self.state.statusBar + sum });
      }, intervalTime);
    });
    this.props.socket.on('productProcessed', function(data) {
      console.log(data);
      clearInterval(interval);
      self.setState({
        status: 'Completo',
        statusBar: 100
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Servidor</h1>
        {this.state.status}
        <div>
            {this.state.name}
            <ProgressBar progress={this.state.statusBar} />
        </div>
      </div>
    );
  }
}

export default ServerStatus;
