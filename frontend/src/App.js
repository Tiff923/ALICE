import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './App.css';
import { Nav, Tab, Navbar } from 'react-bootstrap';
import Dashboard from './layouts/Dashboard/Dashboard';
import NetworkDashboard from './layouts/NetworkDashboard/NetworkDashboard';
import { MdDashboard, MdSettings } from 'react-icons/md';
import { GiMeshNetwork } from 'react-icons/gi';
import {
  getNerData,
  getRelationData,
  getNetworkData,
  getSentimentData,
  getTopicData,
  getNerSearch,
  getKeyData,
  getSummaryData,
  getWordCloud,
  getUploadStatus,
  isUploadingData,
  changeLayout,
  getLayout,
} from './reducers/editstate';
import Loader from 'react-loader-spinner';

import { makeStyles } from '@material-ui/core/styles';
import { RiMenu3Line } from 'react-icons/ri';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles({
  list: {
    height: '100vh',
    width: 250,
    backgroundColor: '#f5f5f5',
  },
});

const App = (props) => {
  const {
    nerData,
    relationData,
    sentimentData,
    networkData,
    topicData,
    summaryData,
    keyData,
    wordCloud,
    nerSearch,
    uploadStatus,
    isUploading,
    changeLayout,
    layout,
  } = props;

  const [key, setKey] = React.useState('dashboard');

  const handleSelect = (eventKey) => {
    setKey(eventKey);
  };

  const classes = useStyles();
  const [open, toggleDrawer] = useState(false);
  const handleDrawerToggle = () => {
    toggleDrawer(!open);
  };

  //(!uploadStatus && !isUploading) ? <Redirect to="/upload" /> :

  return isUploading || uploadStatus !== 'SUCCESS' ? (
    <div className="loader-container">
      <Loader type="Grid" color="#00BFFF" height={100} width={100} />
    </div>
  ) : (
    <div className="wrapper">
      <Tab.Container activeKey={key}>
        <Navbar bg="light" expand="lg" className="navbar-alice">
          <div className="navbar-alice sticky">
            <Navbar.Brand className="navbrand-alice">
              <Link to="/">
                <img
                  src="/logo.png"
                  width="60"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Link>
            </Navbar.Brand>
            {/* <Navbar.Toggle /> */}

            <div className="navbar-drawer">
              <Button onClick={handleDrawerToggle}>
                <RiMenu3Line size={35} />
              </Button>
              <Drawer anchor={'left'} open={open} onClose={handleDrawerToggle}>
                <div
                  className={clsx(classes.list)}
                  onClick={() => toggleDrawer(false)}
                  onKeyDown={() => toggleDrawer(false)}
                >
                  <List>
                    <div className="navbar-drawer-logo">
                      <img
                        src="/logo.png"
                        width="200"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                      />
                    </div>
                    <Divider />
                    {[
                      {
                        text: 'Dashboard',
                        key: 'dashboard',
                        icon: <MdDashboard size={28} color="black" />,
                      },
                      {
                        text: 'Network',
                        key: 'network',
                        icon: <GiMeshNetwork size={28} color="black" />,
                      },
                      {
                        text: 'Settings',
                        key: 'settings',
                        icon: <MdSettings size={28} color="black" />,
                      },
                    ].map((el, index) => (
                      <ListItem
                        button
                        key={el.key}
                        onClick={() => handleSelect(el.key)}
                        // selected={true}
                        className={clsx(classes.selected_item)}
                      >
                        <ListItemIcon>{el.icon}</ListItemIcon>
                        <ListItemText
                          primary={el.text}
                          style={{ color: 'black' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Drawer>
            </div>

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
              summaryData={summaryData}
              wordCloud={wordCloud}
              keyData={keyData}
              nerSearch={nerSearch}
              layout={layout}
              changeLayout={changeLayout}
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
    </div>
  );
};

const mapStateToProps = (store) => ({
  nerData: getNerData(store),
  relationData: getRelationData(store),
  networkData: getNetworkData(store),
  sentimentData: getSentimentData(store),
  summaryData: getSummaryData(store),
  keyData: getKeyData(store),
  wordCloud: getWordCloud(store),
  topicData: getTopicData(store),
  nerSearch: getNerSearch(store),
  layout: getLayout(store),
  uploadStatus: getUploadStatus(store),
  isUploading: isUploadingData(store),
});

const mapDispatchToProps = (dispatch) => ({
  changeLayout: (payload) => dispatch(changeLayout(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
