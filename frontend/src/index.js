import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import testSend from './testSend.js';
import testReceive from './testReceive.js';
import upload from './upload.js';

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import reducer from './reducers';
import rootSaga from './sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard" component={App} />
        {/* <Route path="/dashboard" render={(props) => <App {...props} />} /> */}
        <Route path="/testSend" component={testSend} />
        <Route path="/testReceive" component={testReceive} />
        <Route path="/upload" component={upload} />
        <Redirect from="/" to="/upload" />
        {/* <Route path="/" render={() => <Dashboard />} /> */}
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

sagaMiddleware.run(rootSaga);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

module.hot.accept();
