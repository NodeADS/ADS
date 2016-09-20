import React from 'react';
import SolicitationItem from './SolicitationItem';
import { Collection, CollectionItem } from 'react-materialize';

class SolicitationsCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitations: []
    };
  }

  componentDidMount() {
    this.props.socket.emit('solicitationsProcesseds');
    this.props.socket.on('solicitationsProcesseds', (itens) => {
      this.setState({solicitations: itens});
    });

    this.props.socket.on('completedItem', (item) => {
      let solicitations = this.state.solicitations;
      solicitations.push(item);
      this.setState({solicitations: solicitations});
    });
  }

  render() {
    var solicitationItens = this.state.solicitations.map((sol) => {
      return (
        <CollectionItem key={sol.id}>
          <SolicitationItem solicitation={sol} completed={true} />
        </CollectionItem>
      );
    });
    return (
      <div className={this.state.solicitations.length == 0 ? 'hide' : ''}>
        <Collection header='Solicitações Finalizadas'>
          {solicitationItens}
        </Collection>
      </div>
    );
  }
}

export default SolicitationsCompleted;
