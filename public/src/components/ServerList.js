import React from 'react';
import Qajax from 'qajax';
import Server from './Server';
import { Collection, CollectionItem } from 'react-materialize';

class ServerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: []
    }
  }

  componentDidMount() {
    Qajax('/api/servers')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((servers) => {
        this.setState({servers: servers})
      }, function (err) {
        console.log(err);
      });

    this.props.socket.on('createdServers', (servers) => {
      this.setState({servers: servers})
    })
  }

  render() {
    let nodes = this.state.servers.map((server) => {
      return (
        <CollectionItem key={server.id}>
          <Server server={server} socket={this.props.socket} />
        </CollectionItem>
      );
    });
    return (
      <Collection header='Atendimento'>
        {nodes}
      </Collection>
    )
  }
}

export default ServerList;
