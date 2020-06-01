import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import routes from './routes.js';

const App = () => {
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
      {/* <Sidebar
        {...this.props}
        routes={routes}
        image={this.state.image}
        color={this.state.color}
        hasImage={this.state.hasImage}
      /> */}
      <div id="main-panel" className="main-panel">
        {/* <AdminNavbar
          {...this.props}
          brandText={this.getBrandText(this.props.location.pathname)}
        /> */}
        <Switch>{getRoutes(routes)}</Switch>
        {/* <Footer />
        <FixedPlugin
          handleImageClick={this.handleImageClick}
          handleColorClick={this.handleColorClick}
          handleHasImage={this.handleHasImage}
          bgColor={this.state['color']}
          bgImage={this.state['image']}
          mini={this.state['mini']}
          handleFixedClick={this.handleFixedClick}
          fixedClasses={this.state.fixedClasses}
        /> */}
      </div>
    </div>
  );
};

export default App;
