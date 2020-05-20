import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from './components/StatsCard/StatsCard';
import VisualCard from './components/VisualCard/VisualCard';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import { MdDescription, MdTagFaces, MdCenterFocusStrong } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import nodes from './components/NetworkGraph/nodes.json';
import links from './components/NetworkGraph/links.json';

const App = () => {
  return (
    <div
      className="content"
      styles={{ padding: '30px 15px', minHeight: 'calc(100% - 123px)' }}
    >
      <Container fluid>
        <Row>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<MdDescription color="#ff9500" />}
              statsText="Word count"
              statsValue="10,000"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<MdTagFaces color="#87cb16" />}
              statsText="Sentiment"
              statsValue="Positive"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<MdCenterFocusStrong color="#ff4a55" />}
              statsText="Topic"
              statsValue="COVID-19"
            />
          </Col>
          <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<FaDatabase color="#1dc7ea" />}
              statsText="Classifier"
              statsValue="Disease"
            />
          </Col>
        </Row>
        <Row>
          <NetworkGraph nodes={nodes} links={links} />
        </Row>
        <Row>
          <Col>
            <VisualCard
              id="networkGraph"
              title="Network Graph"
              category="Relationship between Entities"
              content={
                <div className="ct-chart">
                  <NetworkGraph nodes={nodes} links={links} />
                </div>
              }
              // legend={
              //   <div className="legend">{this.createLegend(legendSales)}</div>
              // }
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
