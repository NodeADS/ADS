import React from 'react';
import Qajax from 'qajax';
import { ProgressBar } from 'react-materialize';

class Server extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Parado',
      collor: 'red-text',
      showProgress: true,
      progress: 0
    }
  }

  componentDidMount() {
    Qajax('/api/')
      .then(Qajax.filterSuccess)
      .then(Qajax.toJSON)
      .then((data) => {

      }, function (err) {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h6>{this.props.server.name}</h6>
        <span className={this.state.collor + ' small'}>{this.state.status}</span>
        { this.state.showProgress ? <ProgressBar progress={this.state.progress} /> : null }
      </div>
    )
  }
}

export default Server;
