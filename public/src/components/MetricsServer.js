import React from 'react';
import { Table } from 'react-materialize';

class MetricsServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxTimeComplete: 0,
      maxTimeStart: 0,
      avgInQueue: 0,
      maxInativeTime: 0,
      serverUserPercentage: 0
    };
  }

  componentDidMount() {
    this.props.socket.emit('metricsServer');
    this.props.socket.on('metricsServer', (data) => {
      this.setState(data);
    });

    this.props.socket.on('completedItem', (data) => {
      this.setState({total : this.state.total+1});
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
            {func('Temp máximo para conclusão', this.state.maxTimeComplete)}
            {func('Tempo máximo para inicio', this.state.maxTimeStart)}
            {func('Tempo médio na fila', this.state.avgInQueue)}
            {func('Tempo máximo de inatividade (server)', this.state.maxInativeTime)}
            {func('% uso do Server', this.state.serverUserPercentage)}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default MetricsServer;
