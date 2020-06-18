import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './upload.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { uploadingData, resetState } from './reducers/editstate';
import Header from './components/Header/Header.js'

const Upload = (props) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const { resetState } = props;

  useEffect(() => {
    resetState();
  }, [resetState]);

  const handleOnChangeFile = (event) => {
    var file = event.target.files[0];
    setFile(file);
  };
  const handleOnChangeText = (event) => {
    setText(String(event.target.value));
  };

  const onClickHandler = () => {
    if (text !== '') {
      props.uploadingData([text, 'STRING']);
      props.history.push('/dashboard');
    } else if (file !== null) {
      props.uploadingData([file, 'TXT']);
      props.history.push('/dashboard');
    } else {
      alert('error');
    }
  };

  const newLoad = () => {
    props.resetFile();
  };

  return (
    <div className="upload-container">
      {newLoad}
      <Header></Header>
      <div className="logo-container">
        <img src="./logo.png" width="400" alt="A.L.I.C.E. logo" />
      </div>
      <div className="form-group files">
        <label>Upload Your '.txt' File </label>
        <input
          type="file"
          className="form-control"
          multiple=""
          onChange={handleOnChangeFile}
        ></input>
      </div>
      <form noValidate autoComplete="on">
        <TextField
          id="text-input"
          variant="outlined"
          label="Or Copy your text here"
          // margin="auto"
          fullWidth={true}
          multiline={true}
          rowsMax={15}
          onChange={handleOnChangeText}
        />
      </form>
      <div className="upload-button">
        <Button variant="contained" color="primary" onClick={onClickHandler}>
          Upload
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
