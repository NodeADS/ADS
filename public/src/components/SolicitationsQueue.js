import React from 'react';
import { Collection } from 'react-materialize';
import SolicitationItem from './SolicitationItem';

class SolicitationsQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitations: []
    };

    this.props.socket.on('receivedItem', (item) => {
      let solicitations = this.state.solicitations;
      solicitations.push(item);
      this.setState({solicitations: solicitations});
    });
  }

  render() {
    var solicitationItens = this.state.solicitations.map((sol) => {
      return (
        <SolicitationItem key={sol.id} solicitation={sol} socket={this.props.socket} />
      );
    });
    return (
      <Collection header='Solicitações'>
        {solicitationItens}
      </Collection>
    );
  }
}

export default SolicitationsQueue;
