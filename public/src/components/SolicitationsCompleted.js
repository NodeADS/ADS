import React from 'react';
import Qajax from 'qajax';
import SolicitationItem from './SolicitationItem';
import { Collection, CollectionItem, CollapsibleItem } from 'react-materialize';

class SolicitationsCompleted extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitations: []
    };
  }

  componentDidMount() {
    Qajax('/api/solicitations/completed')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((itens) => {
        this.setState({solicitations: itens});

      }, function (err) {
        console.log(err);
      });


    this.props.socket.on('serverProcessedItem', (server, item) => {
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
