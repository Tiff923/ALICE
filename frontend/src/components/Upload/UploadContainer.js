import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './upload.css';
import { uploadingData, resetState } from '../../reducers/editstate';
import FrontPageHeader from '../FrontPageHeader/FrontPageHeader';
import UploadJson from './UploadJson';
import UploadDB from './UploadDB';
import Upload from './Upload';

const UploadContainer = (props) => {
  const [files, setFiles] = useState([]);
  const [localFiles, setLocalFiles] = useState([]);
  const [text, setText] = useState('');
  const { resetState } = props;

  useEffect(() => {
    resetState();
  }, [resetState]);

  const deleteFile = (event) => {
    setFiles(files.filter((_, i) => i !== event));
  };

  const uploadFiles = () => {
    if (files.length !== 0) {
      props.uploadingData({ files: files, existing: false });
      props.history.push('/dashboard');
    } else {
      alert('No files uploaded');
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const getDbDocument = () => {
    if (text.length !== 0) {
      props.uploadingData({ docId: text, existing: true });
      props.history.push('/dashboard');
    } else {
      alert('No Document ID entered');
    }
  };

  const getJsonDocument = () => {
    if (localFiles.length === 1) {
      props.uploadingData({ files: localFiles[0], existing: true });
      props.history.push('/dashboard');
    } else {
      alert('No document uploaded');
    }
  };

  console.log('Uploaded Files', files);
  console.log('Local Files', localFiles);
  return (
    <div className="upload-container">
      <FrontPageHeader />
      <UploadJson
        localFiles={localFiles}
        setLocalFiles={setLocalFiles}
        getJsonDocument={getJsonDocument}
      />

      <UploadDB
        text={text}
        handleTextChange={handleTextChange}
        getDbDocument={getDbDocument}
      />

      <Upload
        files={files}
        setFiles={setFiles}
        uploadFiles={uploadFiles}
        deleteFile={deleteFile}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
  resetState: (payload) => dispatch(resetState(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(UploadContainer));
