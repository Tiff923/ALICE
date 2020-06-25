import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import './nav.css';

import { makeStyles } from '@material-ui/core/styles';
import { RiMenu3Line } from 'react-icons/ri';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MdDashboard, MdSettings } from 'react-icons/md';
import { GiMeshNetwork } from 'react-icons/gi';

const useStyles = makeStyles({
  list: {
    height: '100vh',
    width: 250,
    backgroundColor: '#f5f5f5',
  },
});

const DashboardNav = (props) => {
  const handleSelect = (eventKey) => {
    props.setKey(eventKey);
  };

  const classes = useStyles();
  const [open, toggleDrawer] = useState(false);
  const handleDrawerToggle = () => {
    toggleDrawer(!open);
  };

  return (
    <Navbar bg="light" expand="lg" className="navbar-alice">
      <div className="navbar-alice sticky">
        <Navbar.Brand className="navbrand-alice">
          <Link to="/">
            <img
              src="/logo.png"
              width="60"
              className="d-inline-block align-top"
              alt="ALICE logo"
            />
          </Link>
        </Navbar.Brand>
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
                    key: 'Dashboard',
                    icon: <MdDashboard size={28} color="black" />,
                    disabled: false,
                  },
                  {
                    text: 'Settings',
                    key: 'Settings',
                    icon: <MdSettings size={28} color="black" />,
                    disabled: false,
                  },
                ].map((el, index) => (
                  <ListItem
                    button
                    key={el.key}
                    onClick={() => handleSelect(el.key)}
                    // selected={true}
                    className={clsx(classes.selected_item)}
                    disabled={el.disabled}
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
              <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="Dashboard">
                <MdDashboard size={28} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link style={{ padding: '1rem 1rem' }} eventKey="Settings">
                <MdSettings size={28} />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default DashboardNav;
