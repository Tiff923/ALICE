import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StatsCard from '../../components/StatsCard/StatsCard';
import VisualCard from '../../components/VisualCard/VisualCard';
import { MdDescription, MdTagFaces, MdCenterFocusStrong } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import './dashboard.css';
import RelationTable from '../../components/RelationExtraction/RelationTable';
import NetworkGraph from '../../components/NetworkGraph/NetworkGraph';
import SentimentGraph from '../../components/SentimentGraph/SentimentGraph';
import NerTable from '../../components/NerTable/NerTable';
import NerDisplacy from '../../components/NerDisplacy/NerDisplacy';
import TopicBubble from '../../components/TopicModelling/TopicBubble';
import { SizeMe } from 'react-sizeme';

import Loader from 'react-loader-spinner';

const Dashboard = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    nerSearch,
  } = props;
  const [selectedNode, setSelectedNode] = useState('');
  const [selectedLink, setSelectedLink] = useState({});

  return (
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
            id="topic-modelling"
            title="Topic Modelling"
            category="Key words and topics"
            content={
              <div style={{ height: 400, width: '100%' }}>
                <TopicBubble data={topicData} />
              </div>
            }
          />
        </Col>
        <Col md={6} sm={12} xs={12}>
          <VisualCard
            id="word-cloud"
            title="Word Cloud"
            category="Word cloud placeholder"
          />
        </Col>
        <Col md={6} sm={12} xs={12}>
          <VisualCard
            id="sentiment-graph"
            title="Sentiment Graph"
            category="Analysis of sentiment"
            content={
              <div style={{ height: 400, width: '100%' }}>
                <SentimentGraph data={sentimentData} />
              </div>
            }
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={12}>
          <VisualCard
            id="relation-table"
            title="Relation Types"
            category="Key entities and relations"
            content={
              <div style={{ width: '100%', overflowX: 'hidden' }}>
                <RelationTable
                  data={relationData}
                  setSelectedLink={setSelectedLink}
                />
              </div>
            }
          />
        </Col>
        <Col lg={7} md={12} sm={12} xs={12}>
          <SizeMe>
            {({ size }) => {
              console.log(size);
              return (
                <VisualCard
                  id="network-graph"
                  title="Network Graph"
                  category="Relationship between Entities"
                  style={{ overflow: 'hidden' }}
                  content={
                    <NetworkGraph
                      height={380}
                      width={size.width - 30}
                      data={networkData}
                      selectedNode={selectedNode}
                      selectedLink={selectedLink}
                    />
                  }
                />
              );
            }}
          </SizeMe>
        </Col>
        <Col lg={8} md={12} sm={12} xs={12}>
          <VisualCard
            id="ner-text"
            title="Named Entity Recognition"
            category="Tagged entities"
            content={<NerDisplacy data={nerData} nerSearch={nerSearch} />}
          />
        </Col>
        <Col lg={4} md={6} sm={12} xs={12}>
          <VisualCard
            id="ner-table"
            title="Named Entities"
            category="Key entities and types"
            content={
              <div style={{ width: '100%', overflowX: 'hidden' }}>
                <NerTable data={nerData} setSelectedNode={setSelectedNode} />
              </div>
            }
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
