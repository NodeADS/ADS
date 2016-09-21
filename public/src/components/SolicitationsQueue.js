import React from 'react';
import Qajax from 'qajax';
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
    Qajax('/api/solicitations/processing')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((itens) => {
        console.log(itens);
        this.setState({solicitations: itens});
        /*if (data.item) {
          let intervalTime = 100
             , initDate = new Date(data.item.startDate)
             , delay = data.item.delay * 1000;

          this.setState({
            status: `Processando ${data.item.name}`,
            collor: 'green-text',
            showProgress: true,
            progress: ((new Date() - initDate) / delay) * 100
          });

          this.interval = setInterval(() => {
            let completed = new Date() - initDate;
            this.setState({ progress: (completed / delay) * 100 });
          }, intervalTime);
        }*/

      }, function (err) {
        console.log(err);
      });

    this.props.socket.on('receivedItem', (item) => {
      let solicitations = this.state.solicitations;
      solicitations.push(item);
      this.setState({solicitations: solicitations});
    });

    this.props.socket.on('serverProcessedItem', (server, item) => {
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
      <Collection header='Solicitações Pendentes'>
        {solicitationItens}
      </Collection>
    );
  }
}

export default SolicitationsQueue;
