import React from 'react';
import { Collection, CollectionItem, CollapsibleItem } from 'react-materialize';
import SolicitationItem from './SolicitationItem';

class SolicitationsQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitations: []
    };
  }

  componentDidMount() {
    this.props.socket.emit('solicitationsProcessing');
    this.props.socket.on('solicitationsProcessing', (data) => {
      var solicitations = [];
      if (data) {
        solicitations.push(data);
      }

      this.props.socket.emit('solicitationsQueue');
      this.props.socket.on('solicitationsQueue', (itens) => {
        solicitations = solicitations.concat(itens);
        this.setState({solicitations: solicitations});
      });
    });



    this.props.socket.on('receivedItem', (item) => {
      let solicitations = this.state.solicitations;
      solicitations.push(item);
      this.setState({solicitations: solicitations});
    });

    this.props.socket.on('completedItem', (item) => {
      let solicitations = this.state.solicitations;
      solicitations = solicitations.filter((sol) => sol.id != item.id);
      this.setState({solicitations: solicitations});
    });
  }

  render() {
    var solicitationItens = this.state.solicitations.map((sol) => {
      return (
        <CollectionItem key={sol.id}>
          <SolicitationItem solicitation={sol} socket={this.props.socket} />
        </CollectionItem>
      );
    });
    return (
      <CollapsibleItem header='Solicitações Pendentes' icon='view_list' expanded={true}>
        <Collection>
          {solicitationItens}
        </Collection>
      </CollapsibleItem>
    );
  }
}

export default SolicitationsQueue;
