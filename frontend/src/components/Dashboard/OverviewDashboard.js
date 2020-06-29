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
import OverviewRelationTable from '../../components/RelationExtraction/OverviewRelationTable';
import NetworkGraph from '../../components/NetworkGraph/NetworkGraph';
import SentimentGraph from '../../components/SentimentGraph/SentimentGraph';
import TopicBubble from '../../components/TopicModelling/TopicBubble';
import OverviewEntityDisplay from '../../components/OverviewNerTable/OverviewEntityDisplay';
import ClusterScatter from '../../components/ClusterScatter/ClusterScatter';

const ResponsiveGridLayout = WidthProvider(Responsive);

const OverviewDashboard = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
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
  const [networkData, setNetworkData] = useState(props.networkData);
  const wordCloudURL = 'data:image/png;base64,' + wordCloud;

  useEffect(() => {
    setSelectedLink(null);
    setSelectedNode(null);
  }, [currentFileName]);

  useEffect(() => {
    setNetworkData(props.networkData);
  }, [props.networkData]);

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
                category={`${networkData.nodes.length} Nodes, ${networkData.links.length} Links`}
                content={
                  <NetworkGraph
                    height={size.height * 0.8}
                    width={size.width - 30}
                    data={networkData}
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
            statsText="Classification"
            statsValue={keyData.topic_classifier.map((e) => (
              <p key={e}>{e}</p>
            ))}
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
                        originalNetwork={props.networkData}
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
                  category={`${networkData.nodes.length} Nodes, ${networkData.links.length} Links`}
                  content={
                    <NetworkGraph
                      height={size.height ? size.height * 0.75 : 0}
                      width={size.width ? size.width - 30 : 0}
                      data={networkData}
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
