import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TwoDGraph from './TwoDGraph';
import ThreeDGraph from './ThreeDGraph';

const NetworkGraph = (props) => {
  const { height, width, data, selectedNode, selectedLink } = props;
  const [is3D, set2Dor3D] = useState(true);

  const handleToggle = (event) => {
    set2Dor3D(!is3D);
  };
  return (
    <div className="network-graph-container">
      <FormControlLabel
        label="3D"
        control={<Switch checked={!is3D} onChange={handleToggle} />}
      />
      {!is3D ? (
        <ThreeDGraph
          height={height}
          width={width}
          data={data}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
        />
      ) : (
        <TwoDGraph
          height={height}
          width={width}
          data={data}
          selectedNode={selectedNode}
          selectedLink={selectedLink}
        />
      )}
    </div>
  );
};
export default React.memo(NetworkGraph);
