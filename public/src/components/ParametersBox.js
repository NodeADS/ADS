import React from 'react';
import { Row, Input, Button } from 'react-materialize';

class ParametersBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: 1,
      rule: 'FIFO',
      outlier: 'Moderado',
      time: 1,
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

  serversChange(e) {
    if (e.target.value >= 1 && e.target.value <= 10) {
      this.setState({servers: e.target.value});
    }
  }

  ruleChange(e) {
    this.setState({rule: e.target.value});
  }

  outlierChange(e) {
    this.setState({outlier: e.target.value});
  }

  timeChange(e) {
    this.setState({time: e.target.value});
  }

  onStart() {
    if (this.state.running) return;
    this.setState({
      running: true
    });
    this.props.socket.emit('start', {
      servers: this.state.servers
    });
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
        <Input s={6} type='number' label="Nº servidores" value={this.state.servers} onChange={this.serversChange} />
        <Input s={6} label="Regra atendimento" value={this.state.rule} onChange={this.ruleChange} />
        <Input s={12} label="Tipo de outlier" value={this.state.outlier} onChange={this.outlierChange} />
        <Button onClick={this.onStart} disabled={this.state.running} >Iniciar</Button>
        <Button onClick={this.onStop} disabled={!this.state.running} >Parar</Button>
      </Row>
    );
  }
  /*
  <Input s={12} type='select' label="Tempo da solicitação" value={this.state.time} onChange={this.timeChange} >
    <option value='1'>Segundos</option>
    <option value='2'>Minutos</option>
  </Input>
  */
}

export default ParametersBox;
