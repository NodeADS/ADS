import React from 'react';
import CreateSolicitation from './CreateSolicitation';
import SolicitationList from './SolicitationList';

class SolicitationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CreateSolicitation socket={this.props.socket} />
        <SolicitationList socket={this.props.socket} />
      </div>
    );
  }
}

export default SolicitationBox;
