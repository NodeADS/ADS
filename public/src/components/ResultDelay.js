import React from 'react';
import Qajax from 'qajax';
import { Table } from 'react-materialize';

class ResultDelay extends React.Component {
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
    Qajax('/api/metrics/delay')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((metrics) => {
        this.setState({
          total: metrics.processeds,
          average: Math.round(metrics.average * 100) / 100,
          mode: metrics.mode,
          median: metrics.median,
          variance: Math.round(metrics.variance * 100) / 100,
          deviation: Math.round(metrics.deviation * 100) / 100
        });
      }, function (err) {
        console.log(err);
      });

    this.props.socket.on('completedItem', (data) => {
      this.setState({total : this.state.total+1});
    });

    this.props.socket.on('recalculateMetricsDelay', (metrics) => {
      this.setState({
        total: metrics.processeds,
        average: Math.round(metrics.average * 100) / 100,
        mode: metrics.mode,
        median: metrics.median,
        variance: Math.round(metrics.variance * 100) / 100,
        deviation: Math.round(metrics.deviation * 100) / 100
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
        <h5 className='left-align'>Tempo Proc.</h5>
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

export default ResultDelay;
