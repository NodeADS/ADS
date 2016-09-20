import 'materialize-css';
import React from 'react';
import ServerBox from './ServerBox';
import SolicitationBox from './SolicitationBox';
import ParametersBox from './ParametersBox';
import ResultsBox from './ResultsBox';
import MetricsBox from './MetricsBox';
import { Row, Col } from 'react-materialize';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row>
          <Col s={6}>
            <ParametersBox socket={this.props.socket} />
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col s={3}>
            <SolicitationBox socket={this.props.socket} />
          </Col>
          <Col s={3}>
            <ServerBox socket={this.props.socket} />
          </Col>
          <Col s={3}>
            <ResultsBox socket={this.props.socket} />
          </Col>
          <Col s={3}>
            <MetricsBox socket={this.props.socket} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
