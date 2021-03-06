import React from 'react';
import Qajax from 'qajax';
import { Table } from 'react-materialize';

class ResultArrival extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      average: 0,
      mode: 0,
      median: 0,
      variance: 0,
      deviation: 0
    };
  }

  componentDidMount() {
    Qajax('/api/metrics/arrival')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((metrics) => {
        this.setState(this.formatJSON(metrics));
      }, function (err) {
        console.log(err);
      });

    this.props.socket.on('updatedArrival', (metrics) => {
      this.setState(this.formatJSON(metrics));
    });

  }

  formatJSON(metrics) {
    return {
      total: metrics.total,
      average: Math.round(metrics.average * 100) / 100,
      mode: metrics.mode,
      median: metrics.median,
      variance: Math.round(metrics.variance * 100) / 100,
      deviation: Math.round(metrics.deviation * 100) / 100
    };
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
        <h5 className='left-align' title='Tempo de chegada das solicitações'>Tempo Cheg.</h5>
        <Table>
          <tbody>
            {func('Total', this.state.total)}
            {func('Média', this.state.average)}
            {func('Mediana', this.state.median)}
            {func('Moda', this.state.mode)}
            {func('Variância', this.state.variance)}
            {func('Desvio Padrão', this.state.deviation)}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ResultArrival;
