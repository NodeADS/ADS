import React from 'react';
import Qajax from 'qajax';
import { Row, Input, Button } from 'react-materialize';

class ParametersBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: 1,
      percentError: 5,
      timeAvgAttendance: 1,
      extraTime: 1,
      running: false
    };

    this.props.socket.on('processing', (running) => {
      this.setState({running: running});
    });

    this.serversChange = this.serversChange.bind(this);
    this.timeAvgAttendanceChange = this.timeAvgAttendanceChange.bind(this);
    this.extraTimeChange = this.extraTimeChange.bind(this);
    this.percentErrorChange = this.percentErrorChange.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.metricClick = this.metricClick.bind(this);
  }

  serversChange(e) {
    if (e.target.value >= 1 && e.target.value <= 10) {
      this.setState({servers: e.target.value});
    }
  }

  timeAvgAttendanceChange(e) {
    this.setState({timeAvgAttendance: e.target.value});
  }

  extraTimeChange(e) {
    this.setState({extraTime: e.target.value});
  }

  timeChange(e) {
    this.setState({time: e.target.value});
  }

  percentErrorChange(e) {
    this.setState({percentError: parseInt(e.target.value)});
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
    this.setState(this.state);
    this.props.socket.emit('stop');
  }

  metricClick() {
    Qajax('/api/metrics/arrival')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((data) => {
        let result = (data.average + this.state.timeAvgAttendance + ((this.state.percentError / 100) * this.state.extraTime)) / this.state.servers;
        alert(result);
      }, function (err) {
        console.log(err);
      });
  }


  render() {
    return (
      <Row>
        <Input s={6} type='number' label="Nº servidores" value={this.state.servers} onChange={this.serversChange} />
        <Input s={6} type='number' label="Porcentagem de Erro" value={this.state.percentError} onChange={this.percentErrorChange} />
        <Input s={6} type='number' label="Média de Atendimento" value={this.state.timeAvgAttendance} onChange={this.timeAvgAttendanceChange} />
        <Input s={6} type='number' label="Tempo Extra" value={this.state.extraTime} onChange={this.extraTimeChange} />
        <Button onClick={this.onStart} disabled={this.state.running} >Iniciar</Button>
        <span> </span>
        <Button onClick={this.onStop} disabled={!this.state.running} >Parar</Button>
        <span> </span>
        <Button onClick={this.metricClick} >Resultado da Métricas</Button>
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
