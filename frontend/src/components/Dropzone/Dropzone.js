import React from 'react';
import './Dropzone.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Dropzone from 'react-dropzone';

const DropzoneContainer = (props) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) =>
        props.setFiles([...props.files, ...acceptedFiles])
      }
      accept="application/pdf,text/plain"
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
              className: `dropzone ${acceptClass} ${rejectClass} ${activeClass}`,
            })}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt size={60} color="#2ea591" />
            {isDragAccept && <span>All files will be accepted</span>}
            {isDragReject && <span>Some files will be rejected</span>}
            {!isDragActive && <span>Drop some files here!</span>}
            <div className="footnote-text">
              <span>Only .pdf and .txt files accepted</span>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
};

export default DropzoneContainer;
