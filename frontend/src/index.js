import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';

import Upload from './Upload.js';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import reducers from './reducers';
import rootSaga from './sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

// const uploading = store.getState().editstate.uploadingData;
// const uploadStatus = store.getState().editstate.uploadStatus;

// const PrivateRoute = ({...props }) =>
//   redirect
//     ? <Redirect to="/upload" />
//     : <Route { ...props } />

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {/* <PrivateRoute redirect={redirect} path="/dashboard" component={App} /> */}
        <Route path="/dashboard">
          <App />
        </Route>

        <Route path="/upload" component={Upload} />
        <Redirect from="/" to="/upload" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

module.hot.accept();
