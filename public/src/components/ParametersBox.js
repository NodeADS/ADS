import React from 'react';
import { Row, Input, Button } from 'react-materialize';

class ParametersBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: 1,
      rule: 'FIFO',
      outlier: 'Moderado',
      running: false
    };

    this.props.socket.on('processing', (running) => {
      this.setState({running: running});
    });

    this.serversChange = this.serversChange.bind(this);
    this.ruleChange = this.ruleChange.bind(this);
    this.outlierChange = this.outlierChange.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  serversChange() {
    this.setState({servers: event.target.value});
  }

  ruleChange() {
    this.setState({rule: event.target.value});
  }

  outlierChange() {
    this.setState({outlier: event.target.value});
  }

  onStart() {
    if (this.state.running) return;
    this.setState({
      running: true
    });
    this.props.socket.emit('start');
  }

  onStop() {
    if (!this.state.running) return;
    this.setState({
      running: false
    });
    this.props.socket.emit('stop');
  }

  render() {
    return (
      <Row>
        <Input s={6} label="Nº servidores" value={this.state.servers} onChange={this.serversChange} />
        <Input s={6} label="Regra atendimento" value={this.state.rule} onChange={this.ruleChange} />
        <Input s={12} label="Tipo de outlier" value={this.state.outlier} onChange={this.outlierChange} />
        <Button onClick={this.onStart} disabled={this.state.running} >Iniciar</Button>
        <Button onClick={this.onStop} disabled={!this.state.running} >Parar</Button>
      </Row>
    );
  }
}

export default ParametersBox;
