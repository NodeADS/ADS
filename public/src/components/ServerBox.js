import React from 'react';
import ServerStatus from './ServerStatus';
import Server from './Server';

class ServerBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ServerStatus socket={this.props.socket} />
    );
  }
}

export default ServerBox;
