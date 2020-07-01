import React from 'react';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div>
        <img src={require('./images/404.jpg')} alt="Error" />
      </div>
      <h2 className="wordstyle">Upload Failed</h2>
    </div>
  );
};

export default ErrorPage;
