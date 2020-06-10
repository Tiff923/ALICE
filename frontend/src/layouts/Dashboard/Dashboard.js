import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';
import StatsCard from '../../components/StatsCard/StatsCard';
import VisualCard from '../../components/VisualCard/VisualCard';
import { MdDescription, MdTagFaces, MdCenterFocusStrong } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import './dashboard.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import RelationTable from '../../components/RelationExtraction/RelationTable';
import NetworkGraph from '../../components/NetworkGraph/NetworkGraph';
import SentimentGraph from '../../components/SentimentGraph/SentimentGraph';
import NerDisplacy from '../../components/NerDisplacy/NerDisplacy';
import TopicBubble from '../../components/TopicModelling/TopicBubble';
import EntityDisplay from '../../components/NerTable/EntityDisplay';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    summaryData,
    keyData,
    wordCloud,
    nerSearch,
    layout,
    changeLayout,
  } = props;
  // const [layouts, setLayout] = useState(layout);
  const [selectedNode, setSelectedNode] = useState('');
  const [selectedLink, setSelectedLink] = useState({});
  const wordCloudURL = 'data:image/png;base64,' + wordCloud;

  const onLayoutChange = (layout, layouts) => {
    changeLayout(layouts);
  };

  return (
    <ResponsiveGridLayout
      margin={[10, 10]}
      containerPadding={[20, 20]}
      rowHeight={30}
      className="layout"
      layouts={layout}
      isDraggable={true}
      isResizable={true}
      onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      breakpoints={{ lg: 1200, md: 991, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 12, sm: 6, xs: 3, xxs: 2 }}
    >
      <div key="key-data-1">
        <StatsCard
          bigIcon={<MdDescription color="#ff9500" />}
          statsText="Word count"
          statsValue={keyData.num_words}
        />
      </div>

      <div key="key-data-2">
        <StatsCard
          bigIcon={<MdTagFaces color="#87cb16" />}
          statsText="Sentiment"
          statsValue={keyData.sentiment}
        />
      </div>

      <div key="key-data-3">
        <StatsCard
          bigIcon={<MdCenterFocusStrong color="#ff4a55" />}
          statsText="Legitimacy"
          statsValue={keyData.legitimacy}
        />
      </div>

      <div key="key-data-4">
        <StatsCard
          bigIcon={<FaDatabase color="#1dc7ea" />}
          statsText="Classifier"
          statsValue={keyData.topic_classifier}
        />
      </div>
      <div key="summary">
        <VisualCard
          title="Summary of document"
          category="PLACEHOLDER"
          content={summaryData}
        />
      </div>

      <div key="topic-modelling">
        <SizeMe monitorHeight>
          {({ size }) => {
            return (
              <VisualCard
                title="Topic Modelling"
                category="Key words and topics"
                content={
                  <div style={{ height: size.height * 0.8, width: '100%' }}>
                    <TopicBubble data={topicData} />
                  </div>
                }
              />
            );
          }}
        </SizeMe>
      </div>

      <div key="word-cloud">
        <SizeMe monitorHeight>
          {({ size }) => {
            return (
              <VisualCard
                title="Word Cloud"
                category="Word cloud placeholder"
                content={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: size * 0.8,
                      width: '100%',
                    }}
                  >
                    <img
                      src={wordCloudURL}
                      alt="word cloud"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                }
              />
            );
          }}
        </SizeMe>
      </div>

      <div key="sentiment-graph">
        <SizeMe monitorHeight>
          {({ size }) => {
            return (
              <VisualCard
                title="Sentiment Graph"
                category="Analysis of sentiment"
                content={
                  <div style={{ height: size.height * 0.8, width: '100%' }}>
                    <SentimentGraph data={sentimentData} />
                  </div>
                }
              />
            );
          }}
        </SizeMe>
      </div>

      <div key="ner-text">
        <VisualCard
          title="Named Entity Recognition"
          category="Tagged entities"
          content={<NerDisplacy data={nerData} nerSearch={nerSearch} />}
        />
      </div>
      <div key="ner-table">
        <SizeMe monitorHeight>
          {({ size }) => {
            return (
              <VisualCard
                title="Named Entities"
                category="Key entities and types"
                content={
                  <div
                    style={{
                      height: size.height * 0.8,
                      width: '100%',
                      overflowX: 'hidden',
                    }}
                  >
                    <EntityDisplay
                      data={nerData}
                      setSelectedNode={setSelectedNode}
                    />
                  </div>
                }
              />
            );
          }}
        </SizeMe>
      </div>
      <div key="relation-table">
        <VisualCard
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
      </div>
      <div key="network-graph">
        <SizeMe monitorHeight>
          {({ size }) => {
            return (
              <VisualCard
                title="Network Graph"
                category="Relationship between Entities"
                style={{ overflow: 'hidden' }}
                content={
                  <NetworkGraph
                    height={size.height * 0.8}
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
      </div>
    </ResponsiveGridLayout>
  );
};

export default Dashboard;
