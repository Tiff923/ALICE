import React from 'react';
import './frontpageheader.css';

const FrontPageHeader = () => {
  return (
    <nav className="front-page-header fixed-top">
      <a className="logo-container" href="/about">
        <img src="./logo.png" width="50" alt="A.L.I.C.E. logo" />
      </a>
      <div className="front-page-link-container">
        <a href="/about">
          <span className="front-page-link-text">About</span>
        </a>
        <a href="/Login">
          <span className="front-page-link-text">Login</span>
        </a>
        <a href="/upload">
          <span className="front-page-link-text">Upload</span>
        </a>
      </div>
    </nav>
  );
};

export default FrontPageHeader;
