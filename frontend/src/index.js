import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';

import Upload from './components/Upload/UploadContainer.js';
import About from './components/FrontPage/About';
import Login from './components/Account/Login.js';
import CreateAcc from './components/Account/CreateAcc.js';
import testLogin from './testLogin.js';

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';

import reducers from './reducers';
import rootSaga from './sagas';
import jwt from 'jsonwebtoken';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const secretKey = 'a very secret key';

const authenticate = () => {
  const userID = localStorage.getItem('userID') || '';
  const userToken = localStorage.getItem('token') || '';
  var cred = '';
  if (userToken === '' || userID === '') {
    alert('Please sign in');
    return false;
  } else {
    try {
      cred = jwt.verify(userToken, secretKey, { algorithms: ['HS256'] });
    } catch (err) {
      console.log(err);
      return false;
    }
    if (userID === cred['user']) {
      return true;
    } else {
      return false;
    }
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const status = authenticate();
  return (
    <Route
      {...rest}
      render={(props) =>
        status === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login?err=invalid" />
        )
      }
    />
  );
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard">
          <App />
        </Route>
        <Route path="/about" component={About} />
        <Route path="/upload" component={Upload} />
        <Route path="/login" component={Login} />
        <Route path="/create" component={CreateAcc} />
        <PrivateRoute path="/test" component={testLogin} />

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
