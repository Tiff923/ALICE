import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import $ from 'jquery';

const Dashboard2DGraph = (props) => {
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

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        height={height}
        width={width}
        backgroundColor={'#969A97'}
        graphData={data}
        linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
        nodeColor={(node) =>
          highlightNodes.has(node.id)
            ? hoverObject.includes(node.id)
              ? 'rgb(255,0,0,1)'
              : 'rgba(255,160,0,0.8)'
            : node.color
        }
        linkDirectionalArrowLength={(link) =>
          highlightLinks.has(link) ? 20 : 10
        }
        linkDirectionalArrowRelPos={0.95}
        linkDirectionalArrowResolution={10}
        onNodeHover={onNodeHover}
        onLinkHover={onLinkHover}
        onNodeClick={(node) => {
          fgRef.current.centerAt(node.x, node.y, 1000);
          fgRef.current.zoom(4, 2000);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
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

export default Dashboard2DGraph;
