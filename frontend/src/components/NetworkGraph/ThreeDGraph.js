import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import './networkgraph.css';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import $ from 'jquery';

const ThreeDGraph = (props) => {
  const { width, height, data, selectedNode, selectedLink } = props;
  const fgRef3D = useRef(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverObject, setHoverObject] = useState([null, null, null]);
  const [showRelationorEntity, setShow] = useState('');

  useEffect(() => {
    fgRef3D.current.d3Force('link').distance(100);
    fgRef3D.current.d3Force('charge').strength(-50);
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

  useEffect(() => {
    var newHoverObject = hoverObject.slice();
    if (selectedNode) {
      var node = data.nodes.find(({ id }) => id === selectedNode);
      highlightNode(node);
      newHoverObject[0] = selectedNode;
      setShow('NODE');
    } else {
      newHoverObject[0] = null;
      if (hoverObject[1]) {
        highlightLink(hoverObject[1]);
        setShow('LINK');
      } else {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        setShow('');
      }
    }
    setHoverObject(newHoverObject);
  }, [selectedNode, data]);

  useEffect(() => {
    var newHoverObject = hoverObject.slice();
    if ($.isEmptyObject(selectedLink)) {
      newHoverObject[1] = null;
      if (hoverObject[0]) {
        var node = data.nodes.find(({ id }) => id === hoverObject[0]);
        highlightNode(node);
        setShow('NODE');
      } else {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        setShow('');
      }
    } else {
      var link = data.links.find(({ source, target }) => {
        return (
          source.id === selectedLink.source && target.id === selectedLink.target
        );
      });
      highlightLink(link);
      newHoverObject[1] = link;
      setShow('LINK');
    }
    setHoverObject(newHoverObject);
  }, [selectedLink, data]);

  const onNodeHover = (node) => {
    if ((!node && !highlightNodes.size) || (node && hoverObject[2] === node.id))
      return;

    var newHoverObject = hoverObject.slice();
    if (node) {
      highlightNode(node);
      newHoverObject[2] = node.id;
    } else {
      if (showRelationorEntity === '') {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
      } else if (showRelationorEntity === 'NODE') {
        var newNode = data.nodes.find(({ id }) => id === hoverObject[0]);
        highlightNode(newNode);
      } else {
        var link = data.links.find(({ source, target }) => {
          return (
            source.id === selectedLink.source &&
            target.id === selectedLink.target
          );
        });
        highlightLink(link);
      }
      newHoverObject[2] = null;
    }
    setHoverObject(newHoverObject);
  };

  const onLinkHover = (link) => {
    if ((!link && !highlightLinks.size) || (link && hoverObject[2] === link))
      return;

    var newHoverObject = hoverObject.slice();

    if (link) {
      highlightLink(link);
      newHoverObject[2] = link;
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      newHoverObject[2] = null;
    }

    setHoverObject(newHoverObject);
  };

  const handleClick = useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 20;
      const distRatio = (1 + distance / Math.hypot(node.x, node.y, node.z)) / 2;

      fgRef3D.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [fgRef3D]
  );

  return (
    <>
      <ForceGraph3D
        ref={fgRef3D}
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
          sprite.color = 'lightgrey';
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
        (hoverObject[2] && typeof hoverObject[2] === 'string' ? (
          <div className="object-details">
            <div>
              <b>id</b>: {hoverObject[2]}
            </div>
          </div>
        ) : hoverObject[2] && typeof hoverObject[2] === 'object' ? (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[2].source.id}
            </div>
            <div>
              <b>Target</b>: {hoverObject[2].target.id}
            </div>
          </div>
        ) : showRelationorEntity === 'NODE' ? (
          <div className="object-details">
            <div>
              <b>id</b>: {hoverObject[0]}
            </div>
          </div>
        ) : (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[1].source.id}
            </div>
            <div>
              <b>Target</b>: {hoverObject[1].target.id}
            </div>
          </div>
        ))}
    </>
  );
};

export default ThreeDGraph;
