import React, { useRef, useEffect } from 'react';
import './networkgraph.css';
import { ForceGraph2D } from 'react-force-graph';
import $ from 'jquery';

const TwoDGraph = (props) => {
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
  } = props;
  const fgRef2D = useRef(null);

  useEffect(() => {
    fgRef2D.current.d3Force('link').distance(linkDistance);
    // fgRef2D.current.d3ReheatSimulation();
  }, [linkDistance]);

  useEffect(() => {
    fgRef2D.current.d3Force('charge').strength(chargeStrength);
    // fgRef2D.current.d3ReheatSimulation();
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

  return (
    <>
      <ForceGraph2D
        ref={fgRef2D}
        height={height}
        width={width}
        backgroundColor={'#f5f5f5'}
        graphData={data}
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
        nodeColor={(node) =>
          highlightNodes.has(node.id)
            ? hoverObject.includes(node.id)
              ? 'rgb(255,0,0,1)'
              : 'rgba(255,160,0,0.8)'
            : node.color
        }
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) =>
          highlightLinks.has(link) ? 4 : 0
        }
        linkDirectionalArrowLength={(link) =>
          highlightLinks.has(link) ? 20 : 10
        }
        linkDirectionalArrowRelPos={0.95}
        linkDirectionalArrowResolution={10}
        onNodeHover={onNodeHover}
        onLinkHover={onLinkHover}
        onNodeClick={(node) => {
          fgRef2D.current.centerAt(node.x, node.y, 1000);
          fgRef2D.current.zoom(4, 2000);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);
        }}
        nodeCanvasObjectMode={() => 'after'}
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

export default TwoDGraph;
