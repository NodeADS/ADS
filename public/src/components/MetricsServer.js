import React from 'react';
import Qajax from 'qajax';
import { Table } from 'react-materialize';
import countdown from 'countdown';

countdown.setLabels(
	' milissegundo| segundo| minuto| hora| dia| semana| mês| ano| década| século| milênio',
	' milissegundos| segundos| minutos| horas| dias| semanas| meses| anos| décadas| séculos| milênios',
	' e ',
	' + ',
	'0');

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
		Qajax('/api/servers/status')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((data) => {
				this.serverStatus(data);
      }, function (err) {
        console.log(err);
      });

			Qajax('/api/metrics/most')
	      .then(Qajax.filterSuccess)
	      .then(Qajax.toJSON)
	      .then((data) => {
					this.setState({
						maxTimeComplete: countdown(0, data.maxTimeComplete).toString() ,
						maxTimeStart: countdown(0, data.maxTimeStart).toString()
					});
	      }, function (err) {
	        console.log(err);
	      });

    this.props.socket.on('mostDelayed', (miliseconds) => {
      this.setState({maxTimeComplete: countdown(0, miliseconds).toString() });
    });

    this.props.socket.on('mostTimeInQueue', (miliseconds) => {
      this.setState({maxTimeStart: countdown(0, miliseconds).toString() });
    });

		this.props.socket.on('updatedServersStatus', (servers) => {
			this.serverStatus(servers);
    });

    this.props.socket.on('updatedAverages', (metrics) => {
      this.setState({
        avgToConclude: countdown(0, metrics.toConclude).toString(),
        avgInQueue: countdown(0, metrics.inQueue).toString()
      });
    });

  }

	serverStatus(servers) {
		let idle = 0
			, prosessing = 0
			, maxIdle = 0
			, useServer = 0;

		for (let i in servers) {
			let status = servers[i];
			idle += status.idleTime;
			prosessing += status.processingTime;
			if (status.maxIdleTime > maxIdle) {
				maxIdle = status.maxIdleTime;
			}
		}

		useServer = (prosessing / (idle + prosessing)) * 100;
		useServer = Math.round(useServer * 100) / 100

		this.setState({
			serverUserPercentage: `${useServer} %`,
			maxInativeTime: `${maxIdle} mili.`
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
						{func('Tempo máximo na fila', this.state.maxTimeStart)}
            {func('Tempo médio para conclusão', this.state.avgToConclude)}
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
