import React, { useState } from 'react';
import TwoDGraph from './TwoDGraph';
import ThreeDGraph from './ThreeDGraph';
import NetworkGraphHeader from './NetworkGraphHeader';

const NetworkGraph = (props) => {
  const {
    height,
    width,
    data,
    selectedNode,
    selectedLink,
    isFullScreen,
    handleFullScreen,
    handleNetworkToggle,
    is2D,
    linkDistance,
    setLinkDistance,
    chargeStrength,
    setChargeStrength,
    cooldownTicks,
    handleFreeze,
  } = props;
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverObject, setHoverObject] = useState([
    selectedNode,
    selectedLink,
    null,
  ]);
  const [showRelationorEntity, setShow] = useState('');

  return (
    <div className="network-graph-container">
      <NetworkGraphHeader
        is2D={is2D}
        isFullScreen={isFullScreen}
        handleFullScreen={handleFullScreen}
        handleNetworkToggle={handleNetworkToggle}
        linkDistance={linkDistance}
        setLinkDistance={setLinkDistance}
        chargeStrength={chargeStrength}
        setChargeStrength={setChargeStrength}
        cooldownTicks={cooldownTicks}
        handleFreeze={handleFreeze}
      />
      {is2D ? (
        <TwoDGraph
          height={height}
          width={width}
          data={data}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
          highlightNodes={highlightNodes}
          setHighlightNodes={setHighlightNodes}
          highlightLinks={highlightLinks}
          setHighlightLinks={setHighlightLinks}
          hoverObject={hoverObject}
          setHoverObject={setHoverObject}
          showRelationorEntity={showRelationorEntity}
          setShow={setShow}
          linkDistance={linkDistance}
          chargeStrength={chargeStrength}
          cooldownTicks={cooldownTicks}
        />
      ) : (
        <ThreeDGraph
          height={height}
          width={width}
          data={data}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
          highlightNodes={highlightNodes}
          setHighlightNodes={setHighlightNodes}
          highlightLinks={highlightLinks}
          setHighlightLinks={setHighlightLinks}
          hoverObject={hoverObject}
          setHoverObject={setHoverObject}
          showRelationorEntity={showRelationorEntity}
          setShow={setShow}
          linkDistance={linkDistance}
          chargeStrength={chargeStrength}
          cooldownTicks={cooldownTicks}
        />
      )}
    </div>
  );
};
export default React.memo(NetworkGraph);
