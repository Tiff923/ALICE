import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { SizeMe } from 'react-sizeme';
import StatsCard from '../../layouts/Header/StatsCard/StatsCard';
import VisualCard from '../../layouts/Header/VisualCard/VisualCard';
import { MdDescription, MdTagFaces, MdCenterFocusStrong } from 'react-icons/md';
import { FaDatabase } from 'react-icons/fa';
import './dashboard.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OverviewRelationTable from '../RelationExtraction/OverviewRelationTable';
import NetworkGraph from '../NetworkGraph/NetworkGraph';
import SentimentGraph from '../Sentiment/SentimentGraph';
import OverviewSentimentTable from '../Sentiment/OverviewSentimentTable';
import TopicBubble from '../TopicModelling/TopicBubble';
import OverviewEntityDisplay from '../OverviewNerTable/OverviewEntityDisplay';
import ClusterScatter from '../ClusterScatter/ClusterScatter';

const ResponsiveGridLayout = WidthProvider(Responsive);

const OverviewDashboard = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    keyData,
    wordCloud,
    clusterData,
    currentFileName,
    setCurrentFileName,
    layout,
    changeLayout,
  } = props;

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedNerRow, setSelectedNerRow] = useState(null);
  const [selectedRelationRow, setSelectedRelationRow] = useState(null);
  const [is2D, set2Dor3D] = useState(true);
  const [linkDistance, setLinkDistance] = useState(500);
  const [chargeStrength, setChargeStrength] = useState(-200);
  const [cooldownTicks, setCooldownTicks] = useState(undefined);
  const [isFullScreen, setFullScreen] = useState(false);
  const [netData, setNetworkData] = useState(networkData);
  const [sentimentEntity, setSentimentEntity] = useState('NIL');
  const wordCloudURL = 'data:image/png;base64,' + wordCloud;

  useEffect(() => {
    setSelectedLink(null);
    setSelectedNode(null);
  }, [currentFileName]);

  useEffect(() => {
    setNetworkData(networkData);
  }, [networkData]);

  const onLayoutChange = (layout, layouts) => {
    changeLayout({ layouts: layouts, fileName: 'Overview' });
  };

  const handleFullScreen = (event) => {
    setFullScreen(!isFullScreen);
  };

  const handleNetworkToggle = (event) => {
    set2Dor3D(!is2D);
  };

  const handleFreeze = (event) => {
    if (cooldownTicks === 0) {
      setCooldownTicks(undefined);
    } else {
      setCooldownTicks(0);
    }
  };

  if (isFullScreen) {
    return (
      <SizeMe monitorHeight>
        {({ size }) => {
          return (
            <div
              id="fullscreen"
              className={isFullScreen ? 'fullscreen-enabled' : ''}
            >
              <VisualCard
                title="Network Graph"
                category={`${netData.nodes.length} Nodes, ${netData.links.length} Links`}
                content={
                  <NetworkGraph
                    height={size.height ? size.height * 0.9 : 0}
                    width={size.width ? size.width - 30 : 0}
                    data={netData}
                    selectedNode={selectedNode}
                    selectedLink={selectedLink}
                    currentFileName={currentFileName}
                    isFullScreen={isFullScreen}
                    handleFullScreen={handleFullScreen}
                    is2D={is2D}
                    handleNetworkToggle={handleNetworkToggle}
                    linkDistance={linkDistance}
                    setLinkDistance={setLinkDistance}
                    chargeStrength={chargeStrength}
                    setChargeStrength={setChargeStrength}
                    cooldownTicks={cooldownTicks}
                    handleFreeze={handleFreeze}
                  />
                }
              />
            </div>
          );
        }}
      </SizeMe>
    );
  } else {
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
        draggableHandle=".viscard-header"
      >
        <div key="key-data-1">
          <StatsCard
            bigIcon={<MdDescription color="#ff9500" />}
            statsText="Word count"
            statsValue={<span>{keyData.num_words}</span>}
          />
        </div>

        <div key="key-data-2">
          <StatsCard
            bigIcon={<MdTagFaces color="#87cb16" />}
            statsText="Sentiment"
            statsValue={<span>{keyData.sentiment}</span>}
          />
        </div>

        <div key="key-data-3">
          <StatsCard
            bigIcon={<MdCenterFocusStrong color="#ff4a55" />}
            statsText="Legitimacy"
            statsValue={<span>{keyData.legitimacy}</span>}
          />
        </div>

        <div key="key-data-4">
          <StatsCard
            bigIcon={<FaDatabase color="#1dc7ea" />}
            statsText="Classification"
            statsValue={keyData.topic_classifier.join(', ')}
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
                  category="Most frequent words"
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

        <div key="sentiment-table">
          <VisualCard
            title="Corpus Sentiment Table"
            category="Breakdown of sentiments towards entities"
            content={
              <div style={{ width: '100%', overflowX: 'hidden' }}>
                <OverviewSentimentTable
                  data={sentimentData[2].sentimentTableData}
                  setCurrentFileName={setCurrentFileName}
                  currentFileName={currentFileName}
                  setSentimentEntity={setSentimentEntity}
                  sentimentWordDocument={sentimentData[2].sentimentWordDocument}
                />
              </div>
            }
          />
        </div>

        <div key="sentiment-wordcloud">
          <SizeMe monitorHeight>
            {({ size }) => {
              return (
                <VisualCard
                  title="Corpus Sentiment Wordcloud"
                  category={
                    <>
                      <span>Current Entity: </span>
                      <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                        {sentimentEntity}
                      </span>
                    </>
                  }
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
                        src={
                          'data:image/png;base64,' +
                          sentimentData[2].sentimentWordCloud
                        }
                        alt="sentiment word cloud"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </div>
                  }
                />
              );
            }}
          </SizeMe>
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
                      <OverviewEntityDisplay
                        data={nerData}
                        originalNetwork={networkData}
                        setSelectedNode={setSelectedNode}
                        selectedNerRow={selectedNerRow}
                        setSelectedNerRow={setSelectedNerRow}
                        setNetworkData={setNetworkData}
                        setCurrentFileName={setCurrentFileName}
                      />
                    </div>
                  }
                />
              );
            }}
          </SizeMe>
        </div>

        <div key="clustering">
          <SizeMe monitorHeight>
            {({ size }) => {
              return (
                <VisualCard
                  title="Document Clustering"
                  category="Documents grouped by topics"
                  content={
                    <div style={{ height: size.height * 0.8, width: '100%' }}>
                      <ClusterScatter data={clusterData} />
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
                <OverviewRelationTable
                  data={relationData}
                  setSelectedLink={setSelectedLink}
                  selectedRelationRow={selectedRelationRow}
                  setSelectedRelationRow={setSelectedRelationRow}
                  setCurrentFileName={setCurrentFileName}
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
                  category={`${netData.nodes.length} Nodes, ${netData.links.length} Links`}
                  content={
                    <NetworkGraph
                      height={size.height ? size.height * 0.75 : 0}
                      width={size.width ? size.width - 30 : 0}
                      data={netData}
                      selectedNode={selectedNode}
                      selectedLink={selectedLink}
                      currentFileName={currentFileName}
                      isFullScreen={isFullScreen}
                      handleFullScreen={handleFullScreen}
                      is2D={is2D}
                      handleNetworkToggle={handleNetworkToggle}
                      linkDistance={linkDistance}
                      setLinkDistance={setLinkDistance}
                      chargeStrength={chargeStrength}
                      setChargeStrength={setChargeStrength}
                      cooldownTicks={cooldownTicks}
                      handleFreeze={handleFreeze}
                    />
                  }
                />
              );
            }}
          </SizeMe>
        </div>
      </ResponsiveGridLayout>
    );
  }
};

export default OverviewDashboard;
