import React from 'react';
import './Dropzone.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Dropzone from 'react-dropzone';

const LocalDropzone = (props) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        if (acceptedFiles.length === 1) {
          props.setFiles(acceptedFiles);
        } else {
          alert('Only 1 .json file is accepted!');
        }
      }}
      accept="application/json"
    >
      {({
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragActive,
        isDragReject,
      }) => {
        const acceptClass = isDragAccept ? 'acceptStyle' : '';
        const rejectClass = isDragReject ? 'rejectStyle' : '';
        const activeClass = isDragActive ? 'activeStyle' : '';
        return (
          <div
            {...getRootProps({
              className: `local-dropzone ${acceptClass} ${rejectClass} ${activeClass}`,
            })}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt size={60} color="#2ea591" />
            {isDragAccept && <span>All files will be accepted</span>}
            {isDragReject && <span>Some files will be rejected</span>}
            {!isDragActive && <span>Drop a .json file here!</span>}
            <div className="footnote-text">
              <span>Only one .json file is accepted</span>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
};

export default LocalDropzone;
