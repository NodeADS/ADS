import React from 'react';
import { Collection, CollectionItem, Row, Col } from 'react-materialize';
import MetricsServer from './MetricsServer';

class MetricsBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Collection header='Métricas'>
        <CollectionItem>
          <Row>
            <Col s={12}>
              <MetricsServer socket={this.props.socket} />
            </Col>
          </Row>
        </CollectionItem>
      </Collection>
    );
  }
}

export default MetricsBox;
