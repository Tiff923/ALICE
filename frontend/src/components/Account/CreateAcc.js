import React, { useState } from 'react';
import Header from '../FrontPageHeader/FrontPageHeader.js';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import './CreateAcc.css';
import axios from 'axios';

const CreateAcc = (props) => {
  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [Role, setRole] = useState('');

  const handleUserInput = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
  };

  const handleSelectChange = (event) => {
    setRole(event.target.value);
  };

  const handleOnClick = () => {
    if (username === '' || password === '' || Role === '') {
      alert('Please input all fields');
    } else {
      const creatorToken = localStorage.getItem('token');
      axios
        .post('http://localhost:5000/create', {
          username: username,
          password: password,
          role: Role,
          creator: creatorToken,
        })
        .then((res) => {
          const data = res.data;
          if (data === 'success') {
            alert('Account created successfully');
          } else if (data === 'invalid') {
            alert('Unauthorised Access');
          } else if (data === 'exist') {
            alert('Account already exists');
          } else {
            alert('Error in creating account');
          }
        });
    }
  };

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
              <h1>Create Account</h1>
              <p>Admin privileges are required to create an account</p>
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
                marginBottom: '10px',
                marginLeft: '30px',
              }}
              onChange={handlePasswordInput}
            />
            <div style={{ textAlign: 'left', marginBottom: '45px' }}>
              <InputLabel
                id="label"
                class="text-left text-dark"
                style={{ marginLeft: '30px' }}
              >
                Role:
              </InputLabel>
              <Select
                labelId="label"
                id="select"
                value={Role}
                style={{ marginLeft: '10px', width: '100px' }}
                onChange={handleSelectChange}
              >
                <MenuItem value={'Admin'}>Admin</MenuItem>
                <MenuItem value={'User'}>User</MenuItem>
              </Select>
            </div>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              style={{ width: '70%', marginLeft: '15%', marginRight: '15%' }}
              onClick={handleOnClick}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAcc;
