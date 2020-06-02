import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RelationTable from '../../components/RelationExtraction/RelationTable';
import TwoDGraph from '../../components/NetworkGraph/TwoDGraph';
import ThreeDGraph from '../../components/NetworkGraph/ThreeDGraph';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import NetworkDashboardGraph from './NetworkDashboardGraph';
import './network-dashboard.css';
import { SizeMe } from 'react-sizeme';

const NetworkDashboard = (props) => {
  const [is3D, set2Dor3D] = useState(true);
  const { networkData, relationData } = props;

  const handleToggle = (event) => {
    set2Dor3D(!is3D);
  };

  return (
    <Container fluid>
      <NetworkDashboardGraph data={networkData} width={400} height={500} />
      {/* <FormControlLabel
        label="3D"
        control={<Switch checked={is3D} onChange={handleToggle} />}
      />
      <SizeMe>
        {({ size }) => {
          console.log(size);
          return (
            <div id="network-graph-dashboard">
              {is3D ? (
                <ThreeDGraph
                  height={500}
                  width={size.width}
                  data={networkData}
                  //   selectedNode={selectedNode}
                  //   selectedLink={selectedLink}
                />
              ) : (
                <TwoDGraph
                  height={500}
                  width={size.width}
                  data={networkData}
                  //   selectedNode={selectedNode}
                  //   selectedLink={selectedLink}
                />
              )}
            </div>
          );
        }}
      </SizeMe>
      <RelationTable data={relationData} /> */}
    </Container>
  );
};

export default NetworkDashboard;
