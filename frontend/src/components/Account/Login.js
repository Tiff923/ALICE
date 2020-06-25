import React, { useState, useEffect } from 'react';
import Header from '../FrontPageHeader/FrontPageHeader.js';
import Button from '@material-ui/core/Button';
import './Login.css';
import axios from 'axios';

const Login = (props) => {
  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');

  const clearState = () => {
    console.log('Clearing state');
    window.localStorage.clear();
  };

  const handleUserInput = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
  };

  const handleOnClick = () => {
    axios
      .post('http://localhost:5000/login', {
        username: username,
        password: password,
      })
      .then((res) => {
        const data = res.data;
        const role = data['Role'];
        if (data['validity'] === 'valid') {
          localStorage.setItem('token', data['token']);
          localStorage.setItem('userID', username);
          localStorage.setItem('Role', role);
          props.history.push('/test');
        } else {
          alert('Invalid User');
        }
      });
  };

  useEffect(() => {
    clearState();
  });

  return (
    <div class="body">
      <Header></Header>
      <div class="backgroundImage">
        <div class="card bg-light loginCard">
          <div class="contentInfo">
            <div
              style={{
                display: 'inline-block',
                textAlign: 'left',
                width: '400px',
                marginTop: '195px',
              }}
            >
              <h1>Welcome</h1>
              <p>
                Please sign in to access the full features of A.L.I.C.E. You can
                request for an account from your supervisor
              </p>
            </div>
          </div>
          <div class="contentAuth">
            <div className="logo-container-login">
              <img
                src="./logo.png"
                width="200"
                height="200"
                alt="A.L.I.C.E. logo"
              />
            </div>
            <input
              type="text"
              placeholder="username"
              style={{
                width: '350px',
                marginBottom: '10px',
                marginLeft: '30px',
              }}
              onChange={handleUserInput}
            />
            <input
              type="text"
              placeholder="password"
              style={{
                width: '350px',
                marginBottom: '30px',
                marginLeft: '30px',
              }}
              onChange={handlePasswordInput}
            />
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={handleOnClick}
              style={{ width: '70%', marginLeft: '15%', marginRight: '15%' }}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
