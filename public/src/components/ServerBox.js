import React from 'react';
import ServerStatus from './ServerStatus';
import ServerList from './ServerList';

class ServerBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ServerList socket={this.props.socket} />
    );
  }
}

export default ServerBox;
