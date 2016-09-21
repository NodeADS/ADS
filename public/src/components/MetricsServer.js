import React from 'react';
import { Table } from 'react-materialize';
import countdown from 'countdown';

countdown.setLabels(
	' milissegundo| segundo| minuto| hora| dia| semana| mês| ano| década| século| milênio',
	' milissegundos| segundos| minutos| horas| dias| semanas| meses| anos| décadas| séculos| milênios',
	' e ',
	' + ',
	'agora');

class MetricsServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxTimeComplete: 0,
      avgToConclude: 0,
      maxTimeStart: 0,
      avgInQueue: 0,
      maxInativeTime: 0,
      serverUserPercentage: 0
    };
  }

  componentDidMount() {
    this.props.socket.on('mostDelayed', (miliseconds) => {
      this.setState({maxTimeComplete: countdown(0, miliseconds).toString() });
    });

    this.props.socket.on('mostTimeInQueue', (miliseconds) => {
      this.setState({maxTimeStart: countdown(0, miliseconds).toString() });
    });

    this.props.socket.on('recalculateMetrics', (metrics) => {
      this.setState({
        avgToConclude: countdown(0, metrics.avgToComplete).toString(),
        avgInQueue: countdown(0, metrics.avgInQueue).toString()
      });
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
            {func('Tempo máximo para conclusão', this.state.maxTimeComplete)}
            {func('Tempo médio para conclusão', this.state.avgToConclude)}
            {func('Tempo máximo na fila', this.state.maxTimeStart)}
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
