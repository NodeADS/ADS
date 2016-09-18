import React from 'react';
import { Row, Input, Button } from 'react-materialize';

class ParametersBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: 1,
      rule: 'FIFO',
      outlier: 'Moderado'
    };

    this.serversChange = this.serversChange.bind(this);
    this.ruleChange = this.ruleChange.bind(this);
    this.outlierChange = this.outlierChange.bind(this);
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

  render() {
    return (
      <Row>
        <Input s={6} label="Nº servidores" value={this.state.servers} onChange={this.serversChange} />
        <Input s={6} label="Regra atendimento" value={this.state.rule} onChange={this.ruleChange} />
        <Input s={12} label="Tipo de outlier" value={this.state.outlier} onChange={this.outlierChange} />
        <Button>Iniciar</Button>
      </Row>
    );
  }
}

export default ParametersBox;
