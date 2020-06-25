import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './upload.css';
import Button from '@material-ui/core/Button';
import Progress from './components/Progress/Progress';
import { uploadingData, resetState } from './reducers/editstate';
import Header from './components/Header/Header.js';

const Upload = (props) => {
  const [file, setFile] = useState([]);
  const { resetState } = props;

  useEffect(() => {
    resetState();
  }, [resetState]);

  const checkMimeType = (event) => {
    let files = event.target.files;
    var err = '';

    const fileTypes = ['text/plain', 'application/pdf'];

    for (var x = 0; x < files.length; x++) {
      var file = files[x];
      if (!fileTypes.includes(file.type)) {
        err = file.type + 'is not a supported format. Only use txt and pdf';
        alert(err);
        return false;
      }
    }
    return true;
  };

  const handleOnChangeFile = (event) => {
    var files = event.target.files;
    if (checkMimeType(event)) {
      setFile(files);
    }
  };

  const onClickHandler = () => {
    if (file !== null) {
      props.uploadingData(file);
      props.history.push('/dashboard');
    } else {
      alert('error');
    }
  };

  return (
    <div className="upload-container">
      <div className="logo-container">
        <img src="./logo.png" width="400" alt="A.L.I.C.E. logo" />
      </div>
      <div className="form-group files">
        <label>Upload Your '.txt' File </label>
        <input
          type="file"
          className="form-control"
          multiple={true}
          onChange={handleOnChangeFile}
        ></input>
      </div>
      <div className="upload-button">
        <Button variant="contained" color="primary" onClick={onClickHandler}>
          <span>Upload</span>
        </Button>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
  resetState: (payload) => dispatch(resetState(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(Upload));
