import React from 'react';
import { Sigma, RelativeSize, RandomizeNodePositions } from 'react-sigma';

const NetworkGraph = () => {
  return (
    <Sigma
      // onClickNode={function noRefCheck() {}}
      renderer="webgl"
      settings={{
        drawEdges: true,
      }}
      onOverNode={(e) => console.log('Mouse over node: ' + e.data.node.label)}
      graph={{
        nodes: ['id0', 'id1'],
        edges: [{ id: 'e0', source: 'id0', target: 'id1' }],
      }}
    >
      <RelativeSize initialSize={8} />
      <RandomizeNodePositions />
      {/* <LoadJSON path="./data.json">
        <RandomizeNodePositions>
          <ForceAtlas2
            barnesHutOptimize
            barnesHutTheta={0.6}
            iterationsPerRender={3}
            linLogMode
            worker
          />
          <RelativeSize initialSize={8} />
        </RandomizeNodePositions>
      </LoadJSON> */}
    </Sigma>
  );
};

// const NetworkGraph = (props) => {
//   return (
//     <ResponsiveNetwork
//       nodes={props.nodes.nodes}
//       links={props.links.links}
//       margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
//       repulsivity={6}
//       iterations={60}
//       nodeColor={function (t) {
//         return t.color;
//       }}
//       nodeBorderWidth={1}
//       nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
//       linkThickness={function (t) {
//         return 2 * (2 - t.source.depth);
//       }}
//       motionStiffness={160}
//       motionDamping={12}
//     />
//   );
// };

export default NetworkGraph;
