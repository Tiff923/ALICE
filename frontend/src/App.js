import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { Nav, Tab } from 'react-bootstrap';
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
} from './reducers/editstate';

import routes from './routes.js';

const App = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    nerSearch,
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

  return (
    <div className="wrapper">
      <Tab.Container defaultActiveKey="dashboard">
        <Nav variant="pills" fill={true} className="sidebar">
          <Nav.Item className="nav-item">
            <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="dashboard">
              <MdDashboard size={28} />
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="network">
              <GiMeshNetwork size={28} />
            </Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="save">
                <MdSave size={30} />
              </Nav.Link>
            </Nav.Item> */}
          <Nav.Item className="nav-item">
            <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="settings">
              <MdSettings size={28} />
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="main-panel">
          <Tab.Pane eventKey="dashboard" className="main-panel">
            <Dashboard
              nerData={nerData}
              relationData={relationData}
              sentimentData={sentimentData}
              networkData={networkData}
              topicData={topicData}
              nerSearch={nerSearch}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="network" className="main-panel">
            <NetworkDashboard
              relationData={relationData}
              networkData={networkData}
            />
          </Tab.Pane>
          {/* <Tab.Pane eventKey="save">bye</Tab.Pane> */}
          <Tab.Pane eventKey="settings" className="main-panel">
            bye
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* <AdminNavbar
          {...this.props}
          brandText={this.getBrandText(this.props.location.pathname)}
        /> */}
      {/* <Switch>{getRoutes(routes)}</Switch> */}
    </div>
  );
};

const mapStateToProps = (store) => ({
  nerData: getNerData(store),
  relationData: getRelationData(store),
  networkData: getNetworkData(store),
  sentimentData: getSentimentData(store),
  topicData: getTopicData(store),
  nerSearch: getNerSearch(store),
});

export default connect(mapStateToProps, null)(App);
