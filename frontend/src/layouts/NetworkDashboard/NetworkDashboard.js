import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Dashboard2DGraph from './Dashboard2DGraph';
import Dashboard3DGraph from './Dashboard3DGraph';
import NetworkDashboardTable from './NetworkDashboardTable';
import './network-dashboard.css';
import { SizeMe } from 'react-sizeme';

const NetworkDashboard = (props, { size }) => {
  const [is3D, set2Dor3D] = useState(true);
  const [isFullScreen, setFullScreen] = useState(false);
  const [selectedLink, setSelectedLink] = useState({});
  const { networkData, relationData } = props;
  const [data, selectData] = useState(networkData);

  const handleToggle = (event) => {
    set2Dor3D(!is3D);
  };

  const handleFullScreen = (event) => {
    setFullScreen(!isFullScreen);
  };

  return (
    <Container id="network-dashboard-container" fluid>
      <SizeMe monitorHeight>
        {({ size }) => {
          return (
            <div
              id="fullscreen"
              className={isFullScreen ? 'fullscreen-enabled' : ''}
            >
              <Row>
                <div className="options-container">
                  <FormControlLabel
                    label="3D"
                    control={
                      <Switch
                        color="primary"
                        checked={!is3D}
                        onChange={handleToggle}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Fullscreen"
                    control={
                      <Switch
                        color="primary"
                        checked={isFullScreen}
                        onChange={handleFullScreen}
                      />
                    }
                  />
                </div>
              </Row>
              <Row lg={1}>
                <Col xs={12} sm={12} md={12}>
                  {!is3D ? (
                    <div id="network-graph-dashboard-container">
                      <Dashboard3DGraph
                        data={data}
                        height={size.height - 86}
                        width={size.width}
                        selectedLink={selectedLink}
                      />
                    </div>
                  ) : (
                    <div id="network-graph-dashboard-container">
                      <Dashboard2DGraph
                        data={data}
                        height={size.height - 86}
                        width={size.width}
                        selectedLink={selectedLink}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          );
        }}
      </SizeMe>
      <div className="reg-container">
        <Col xs={12} sm={8} md={8}>
          <div className="reg-subcontainer">
            <NetworkDashboardTable
              data={relationData}
              selectData={selectData}
              setSelectedLink={setSelectedLink}
            />
          </div>
        </Col>
        <Col xs={12} sm={4} md={4}>
          <div className="reg-subcontainer">
            <div id="network-graph-info"></div>
          </div>
        </Col>
      </div>
    </Container>
  );
};

export default NetworkDashboard;
