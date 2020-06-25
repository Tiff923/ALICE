import React from 'react';
import './frontpageheader.css';
import { FaCloudUploadAlt } from 'react-icons/fa';

const FrontPageHeader = () => {
  return (
    <nav className="front-page-header fixed-top">
      <a className="logo-container" href="/about">
        <img src="./logo.png" width="50" alt="A.L.I.C.E. logo" />
      </a>
      <a href="/upload" className="front-page-header-link">
        <FaCloudUploadAlt size={25} />
        <span className="front-page-header-text">Upload</span>
      </a>
    </nav>
  );
};

export default FrontPageHeader;
