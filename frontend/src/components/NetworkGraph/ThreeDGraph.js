import React, { useRef, useCallback, useEffect } from 'react';
import './networkgraph.css';
import { ForceGraph3D } from 'react-force-graph';
import SpriteText from 'three-spritetext';
import $ from 'jquery';
// var three = window.THREE ? window.THREE : require('three');

const ThreeDGraph = (props) => {
  const {
    width,
    height,
    data,
    selectedNode,
    selectedLink,
    highlightNodes,
    setHighlightNodes,
    highlightLinks,
    setHighlightLinks,
    hoverObject,
    setHoverObject,
    showRelationorEntity,
    setShow,
    linkDistance,
    chargeStrength,
    cooldownTicks,
  } = props;
  const fgRef3D = useRef(null);

  useEffect(() => {
    // if (fgRef3D) {
    //   fgRef3D.current.d3ReheatSimulation();
    // }
    fgRef3D.current.d3Force('link').distance(linkDistance);
    // fgRef3D.current.d3ReheatSimulation();
  }, [linkDistance]);

  useEffect(() => {
    // if (fgRef3D) {
    //   fgRef3D.current.d3ReheatSimulation();
    // }
    fgRef3D.current.d3Force('charge').strength(chargeStrength);
    // fgRef3D.current.d3ReheatSimulation();
  }, [chargeStrength]);

  const highlightNode = (node) => {
    if (node) {
      var nodeArr = [];
      node.neighbors.forEach((neighbor) => nodeArr.push(neighbor));
      nodeArr.push(node.id);
      setHighlightNodes(new Set(nodeArr));
      var linkArr = data['links'].filter((link) => {
        return link.source.id === node.id || link.target.id === node.id;
      });
      setHighlightLinks(new Set(linkArr));
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      setShow('');
    }
  };

  const highlightLink = (link) => {
    if (link) {
      setHighlightLinks(new Set([link]));
      var nodeArr = [];
      nodeArr.push(link.source.id);
      nodeArr.push(link.target.id);
      setHighlightNodes(new Set(nodeArr));
    } else {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      setShow('');
    }
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
    } else if (showRelationorEntity === 'NODE') {
      var newNode = data.nodes.find(({ id }) => id === hoverObject[0]);
      newHoverObject[2] = null;
      highlightNode(newNode);
    } else if (showRelationorEntity === 'LINK') {
      var newLink = data.links.find(({ source, target }) => {
        return (
          source.id === selectedLink.source && target.id === selectedLink.target
        );
      });
      newHoverObject[2] = null;
      highlightLink(newLink);
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
        // cooldownTicks={cooldownTicks}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        }}
        nodeOpacity={0.9}
        nodeColor={(node) =>
          highlightNodes.has(node.id)
            ? hoverObject.includes(node.id)
              ? 'rgb(255,0,0,1)'
              : 'rgba(255,160,0,0.8)'
            : node.color
        }
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.name);
          sprite.color = node.color;
          sprite.textHeight = 8;
          sprite.position.y = -node.val;
          return sprite;
        }}
        nodeThreeObjectExtend={true}
        linkWidth={(link) => (highlightLinks.has(link) ? 5 : 2)}
        // linkThreeObjectExtend={true}
        // linkThreeObject={(link) => {
        //   const sprite = new SpriteText(
        //     `${link.source.name} > ${link.target.name}`
        //   );
        //   sprite.color = 'black';
        //   sprite.textHeight = 3;
        //   return sprite;
        // }}
        // linkPositionUpdate={(sprite, { start, end }) => {
        //   const middlePos = Object.assign(
        //     ...['x', 'y', 'z'].map((c) => ({
        //       [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
        //     }))
        //   );
        //   Object.assign(sprite.position, middlePos);
        // }}
        onNodeClick={handleClick}
        onNodeHover={onNodeHover}
        onLinkHover={onLinkHover}
      />
      {!hoverObject.every((element) => element === null) &&
        (hoverObject[2] && typeof hoverObject[2] === 'string' ? (
          <div className="object-details">
            <div>
              <b>Entity</b>:{' '}
              {hoverObject[2].indexOf('_') === -1
                ? hoverObject[2]
                : hoverObject[2].slice(0, hoverObject[2].indexOf('_'))}
            </div>
          </div>
        ) : hoverObject[2] && typeof hoverObject[2] === 'object' ? (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[2].source.name}
            </div>
            <div>
              <b>Target</b>: {hoverObject[2].target.name}
            </div>
            <div>
              <b>Relation</b>: {hoverObject[2].relation}
            </div>
          </div>
        ) : hoverObject[0] && showRelationorEntity === 'NODE' ? (
          <div className="object-details">
            <div>
              <b>Entity</b>:{' '}
              {hoverObject[0].indexOf('_') === -1
                ? hoverObject[0]
                : hoverObject[0].slice(0, hoverObject[0].indexOf('_'))}
            </div>
          </div>
        ) : hoverObject[1] && showRelationorEntity === 'LINK' ? (
          <div className="object-details">
            <div>
              <b>Source</b>: {hoverObject[1].source.name}
            </div>
            <div>
              <b>Target</b>: {hoverObject[1].target.name}
            </div>
            <div>
              <b>Relation</b>: {hoverObject[1].relation}
            </div>
          </div>
        ) : null)}
    </>
  );
};

export default ThreeDGraph;
