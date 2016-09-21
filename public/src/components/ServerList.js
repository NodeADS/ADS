import React from 'react';
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
    this.props.socket.on('createdServers', (servers) => {
      this.setState({servers: servers})
    })
  }

  render() {
    let nodes = this.state.servers.map((server) => {
      <CollectionItem key={server.id}>
        <Server server={server} />
      </CollectionItem>
    });
    return (
      <Collection header='Atendimento'>
        {nodes}
      </Collection>
    )
  }
}

export default ServerList;
