import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
// import './networkgraph.css';
import SpriteText from 'three-spritetext';
import { ForceGraph3D } from 'react-force-graph';
import $ from 'jquery';
var three = window.THREE ? window.THREE : require('three');

const Dashboard3DGraph = (props) => {
  const { width, height, data, selectedLink } = props;
  const fgRef = useRef(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverObject, setHoverObject] = useState([null, null]);

  useEffect(() => {
    fgRef.current.d3Force('link').distance(100);
    fgRef.current.d3Force('charge').strength(-50);
  }, []);

  const highlightNode = (node) => {
    var nodeArr = [];
    node.neighbors.forEach((neighbor) => nodeArr.push(neighbor));
    nodeArr.push(node.id);
    setHighlightNodes(new Set(nodeArr));
    var linkArr = data['links'].filter((link) => {
      return link.source.id === node.id || link.target.id === node.id;
    });
    setHighlightLinks(new Set(linkArr));
  };

  const highlightLink = (link) => {
    setHighlightLinks(new Set([link]));
    var nodeArr = [];
    nodeArr.push(link.source.id);
    nodeArr.push(link.target.id);
    setHighlightNodes(new Set(nodeArr));
  };

  useLayoutEffect(() => {
    var newHoverObject = hoverObject.slice();
    if ($.isEmptyObject(selectedLink)) {
      newHoverObject[0] = null;

      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
    } else {
      var link = data.links.find(({ source, target }) => {
        return (
          source.id === selectedLink.source && target.id === selectedLink.target
        );
      });
      highlightLink(link);
      newHoverObject[0] = link;
    }
    setHoverObject(newHoverObject);
  }, [selectedLink, data]);

  const onNodeHover = (node) => {
    if ((!node && !highlightNodes.size) || (node && hoverObject[1] === node.id))
      return;

    var newHoverObject = hoverObject.slice();
    if (node) {
      highlightNode(node);
      newHoverObject[1] = node.id;
    } else {
      if ($.isEmptyObject(hoverObject[0])) {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
      } else {
        var link = data.links.find(({ source, target }) => {
          return (
            source.id === selectedLink.source &&
            target.id === selectedLink.target
          );
        });
        highlightLink(link);
      }
      newHoverObject[1] = null;
    }
    setHoverObject(newHoverObject);
  };

  const onLinkHover = (link) => {
    if ((!link && !highlightLinks.size) || (link && hoverObject[1] === link))
      return;

    var newHoverObject = hoverObject.slice();

    if (link) {
      highlightLink(link);
      newHoverObject[1] = link;
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      newHoverObject[1] = null;
    }

    setHoverObject(newHoverObject);
  };

  const handleClick = useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 20;
      const distRatio = (1 + distance / Math.hypot(node.x, node.y, node.z)) / 2;

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [fgRef]
  );

  return (
    <>
      <ForceGraph3D
        ref={fgRef}
        height={height}
        width={width}
        backgroundColor={'#f5f5f5'}
        graphData={data}
        nodeOpacity={0.9}
        nodeColor={(node) =>
          highlightNodes.has(node.id)
            ? hoverObject.includes(node.id)
              ? 'rgb(255,0,0,1)'
              : 'rgba(255,160,0,0.8)'
            : node.color
        }
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id);
          sprite.color = node.color;
          sprite.textHeight = 8;
          sprite.position.y = -node.val;
          return sprite;
        }}
        nodeThreeObjectExtend={true}
        linkWidth={(link) => (highlightLinks.has(link) ? 3 : 2)}
        linkDirectionalParticles={(link) => (highlightLinks.has(link) ? 2 : 0)}
        linkDirectionalParticleWidth={4}
        linkThreeObjectExtend={true}
        linkThreeObject={(link) => {
          const sprite = new SpriteText(
            `${link.source.id} > ${link.target.id}`
          );
          sprite.color = 'black';
          sprite.textHeight = 3;
          return sprite;
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          const middlePos = Object.assign(
            ...['x', 'y', 'z'].map((c) => ({
              [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
            }))
          );
          Object.assign(sprite.position, middlePos);
        }}
        onNodeClick={handleClick}
        onNodeHover={onNodeHover}
        onLinkHover={onLinkHover}
      />
      {!hoverObject.every((element) => element === null) &&
        (hoverObject[1] && typeof hoverObject[1] === 'string' ? (
          <div className="object-details">
            <div>
              <b>id</b>: {hoverObject[1]}
            </div>
          </div>
        ) : hoverObject[1] && typeof hoverObject[1] === 'object' ? (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[1].source.id}
            </div>
            <div>
              <b>Target</b>: {hoverObject[1].target.id}
            </div>
          </div>
        ) : (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[0].source.id}
            </div>
            <div>
              <b>Target</b>: {hoverObject[0].target.id}
            </div>
          </div>
        ))}
    </>
  );
};

export default Dashboard3DGraph;
