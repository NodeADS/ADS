import React from 'react';
import { Table } from 'react-materialize';

class ResultServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      average: 0,
      mode: 0,
      variance: 0,
      deviation: 0
    };
  }

  componentDidMount() {
    this.props.socket.emit('resultServer');
    this.props.socket.on('resultServer', (data) => {
      this.setState(data);
    });

    this.props.socket.on('completedItem', (data) => {
      this.setState({total : this.state.total+1});
    });

    this.props.socket.on('recalculateMetrics', (metrics) => {
      console.log(metrics);
    });
  }

  render() {
    let func = (name, value) => {
      return (
        <tr>
          <td>{name}</td>
          <td>{value}</td>
        </tr>
      );
    };

    return (
      <div>
        <h5 className='left-align'>Atendimento</h5>
        <Table>
          <tbody>
            {func('Total', this.state.total)}
            {func('Média', this.state.average)}
            {func('Moda', this.state.mode)}
            {func('Variância', this.state.variance)}
            {func('Desvio Padrão', this.state.deviation)}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ResultServer;
