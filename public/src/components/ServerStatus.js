import React from 'react';

class ServerStatus extends React.Component {
  constructor(props) {
    super(props);
    var self = this;
    this.state = {
      status: 'Aguardando...'
    };

    this.props.socket.on('processingProduct', function(){
      self.setState({status: 'Processando'});
    });
    this.props.socket.on('productProcessed', function(){
      self.setState({status: 'Completo'});
    });
  }

  render() {
    return (
      <div>
        <h1>Servidor</h1>
        {this.state.status}
      </div>
    );
  }
}

export default ServerStatus;
