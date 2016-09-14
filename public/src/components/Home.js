import 'materialize-css'
import React from 'react';
import ServerBox from './ServerBox.js'
import ProductBox from './ProductBox.js'
import { Row, Col } from 'react-materialize';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Row>
        <Col s={4}>
          <ProductBox socket={this.props.socket} />
        </Col>
        <Col s={8}>
          <ServerBox socket={this.props.socket} />
        </Col>
      </Row>
    );
  }
}

export default Home;
