import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import './App.css';
import { Nav, Tab, Navbar, Tabs } from 'react-bootstrap';
import Dashboard from './layouts/Dashboard/Dashboard';
import NetworkDashboard from './layouts/NetworkDashboard/NetworkDashboard';
import { MdDashboard, MdSave, MdSettings } from 'react-icons/md';
import { GiMeshNetwork } from 'react-icons/gi';
import {
  getNerData,
  getRelationData,
  getNetworkData,
  getSentimentData,
  getTopicData,
  getNerSearch,
    getKeyData,
  getUploadStatus,
  isUploadingData
} from './reducers/editstate';

import routes from './routes.js';


import Loader from 'react-loader-spinner';

const App = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    keyData,
    nerSearch,
    uploadStatus,
    isUploading
  } = props;

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const [key, setKey] = React.useState('dashboard');

  const handleSelect = (eventKey) => {
    setKey(eventKey);
  };
//(!uploadStatus && !isUploading) ? <Redirect to="/upload" /> : 
  return ( uploadStatus === 'SUCCESS' ? (
         <div className="wrapper"> 
         <Tab.Container activeKey={key}>
        <Navbar bg="light" expand="lg" className="navbar-alice">
          <div className="navbar-alice sticky">
            <Navbar.Brand className="navbrand-alice">
              <img
              href="/"
                src="/logo.png"
                width="60"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav
                variant="pills"
                fill={true}
                navbar={true}
                className="sidebar"
                onSelect={handleSelect}
                role="tablist"
              >
                <Nav.Item>
                  <Nav.Link
                    style={{ padding: '1rem 1rem' }}
                    eventKey="dashboard"
                  >
                    <MdDashboard size={28} />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="network">
                    <GiMeshNetwork size={28} />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    style={{ padding: '1rem 1rem' }}
                    eventKey="settings"
                    href="#settings"
                  >
                    <MdSettings size={28} />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>

        <Tab.Content className="main-panel">
          <Tab.Pane eventKey="dashboard" className="main-panel">
            <Dashboard
              nerData={nerData}
              relationData={relationData}
              sentimentData={sentimentData}
              networkData={networkData}
              topicData={topicData}
              keyData={keyData}
              nerSearch={nerSearch}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="network" className="main-panel">
            <NetworkDashboard
              relationData={relationData}
              networkData={networkData}
            />
          </Tab.Pane>

          <Tab.Pane eventKey="settings" className="main-panel">
            bye
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>    
      </div> ) : ( <div className="loader-container"><Loader
      type="Grid"
      color="#00BFFF"
      height={100}
      width={100}
   /></div>)
      
  );
};

const mapStateToProps = (store) => ({
  nerData: getNerData(store),
  relationData: getRelationData(store),
  networkData: getNetworkData(store),
  sentimentData: getSentimentData(store),
  keyData: getKeyData(store),
  topicData: getTopicData(store),
  nerSearch: getNerSearch(store),
  
  uploadStatus: getUploadStatus(store),
  isUploading: isUploadingData(store)
});

export default connect(mapStateToProps, null)(App);
