import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from './components/StatsCard/StatsCard';
import VisualCard from './components/VisualCard/VisualCard';
import { MdDescription, MdTagFaces, MdCenterFocusStrong } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import './dashboard.css';
import RelationTable from './components/RelationExtraction/RelationTable';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import SentimentGraph from './components/SentimentGraph/SentimentGraph';
import NerTable from './components/NerTable/NerTable';
import NerDisplacy from './components/NerDisplacy/NerDisplacy';
import TopicBubble from './components/TopicModelling/TopicBubble';
import {
  getNerData,
  getRelationData,
  getNetworkData,
  getSentimentData,
  getTopicData,
} from './reducers/editstate';
import Loader from 'react-loader-spinner';

const Dashboard = (props) => {
  return (
    <>
      {/* <div>
        <Loader
          type="Grid"
          color="#00BFFF"
          height={80}
          width={80}
          timeout={3000}
          position={'fixed'}
          top={0}
          right={0}
          bottom={0}
          left={0}
          background={'#fff'}
        />
      </div> */}

      <div
        className="content"
        styles={{ padding: '30px 15px', minHeight: 'calc(100% - 123px)' }}
      >
        <Container fluid>
          <Row lg={4}>
            <Col md={6} sm={6}>
              <StatsCard
                bigIcon={<MdDescription color="#ff9500" />}
                statsText="Word count"
                statsValue="10248"
              />
            </Col>
            <Col md={6} sm={6}>
              <StatsCard
                bigIcon={<MdTagFaces color="#87cb16" />}
                statsText="Sentiment"
                statsValue="Positive"
              />
            </Col>
            <Col md={6} sm={6}>
              <StatsCard
                bigIcon={<MdCenterFocusStrong color="#ff4a55" />}
                statsText="Legitimacy"
                statsValue="Trusted"
              />
            </Col>
            <Col md={6} sm={6}>
              <StatsCard
                bigIcon={<FaDatabase color="#1dc7ea" />}
                statsText="Classifier"
                statsValue="Politics"
              />
            </Col>
          </Row>
          <Row lg={3}>
            <Col md={6} sm={12} xs={12}>
              <VisualCard
                id="topicModelling"
                title="Topic Modelling"
                category="Key words and topics"
                content={
                  <div style={{ height: 400, width: '100%' }}>
                    <TopicBubble data={props.topicData} />
                  </div>
                }
              />
            </Col>
            <Col md={6} sm={12} xs={12}>
              <VisualCard
                id="wordCloud"
                title="Word Cloud"
                category="Word cloud placeholder"
              />
            </Col>
            <Col md={6} sm={12} xs={12}>
              <VisualCard
                id="sentimentGraph"
                title="Sentiment Graph"
                category="Analysis of sentiment"
                content={
                  <div style={{ height: 400, width: '100%' }}>
                    <SentimentGraph data={props.sentimentData} />
                  </div>
                }
              />
            </Col>
            <Col lg={5} md={6} sm={12} xs={12}>
              <VisualCard
                id="relationTable"
                title="Relation Types"
                category="Key entities and relations"
                content={
                  <div style={{ width: '100%', overflowX: 'hidden' }}>
                    <RelationTable data={props.relationData} />
                  </div>
                }
              />
            </Col>
            <Col lg={7} md={12} sm={12} xs={12}>
              {/* <Card>
              <Card.Title>Card Title</Card.Title>
              <Card.Body></Card.Body>
                <NetworkGraph data={props.networkData} />
              </Card.Body>
              </Card> */}
              <VisualCard
                id="networkGraph"
                title="Network Graph"
                category="Relationship between Entities"
                style={{ overflow: 'hidden' }}
                content={<NetworkGraph data={props.networkData} />}
                // summary={
                //   <div className="summary-header">
                //     <h2>Nodes: {props.networkData.nodes.length}</h2>
                //     <h2>Links: {props.networkData.links.length}</h2>
                //   </div>
                // }
              />
            </Col>
            <Col lg={8} md={12} sm={12} xs={12}>
              <VisualCard
                id="nerText"
                title="Named Entity Recognition"
                category="Tagged entities"
                content={<NerDisplacy data={props.nerData} />}
              />
            </Col>
            <Col lg={4} md={6} sm={12} xs={12}>
              <VisualCard
                id="nerTable"
                title="Named Entities"
                category="Key entities and types"
                content={
                  <div style={{ width: '100%', overflowX: 'hidden' }}>
                    <NerTable data={props.nerData} />
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

const mapStateToProps = (store) => ({
  nerData: getNerData(store),
  relationData: getRelationData(store),
  networkData: getNetworkData(store),
  sentimentData: getSentimentData(store),
  topicData: getTopicData(store),
});

export default connect(mapStateToProps, null)(Dashboard);
