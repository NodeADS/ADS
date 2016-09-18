import React from 'react';
import { Table } from 'react-materialize';

class ResultSolicitation extends React.Component {
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
    this.props.socket.emit('totalSolicitations');
    this.props.socket.on('totalSolicitations', (data) => {
      this.setState({total : data});
    });

    this.props.socket.on('receivedItem', (data) => {
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
        <h5 className='left-align'>Solicitações</h5>
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

export default ResultSolicitation;
