import React from 'react';
import './upload.css';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaRegFileCode } from 'react-icons/fa';
import LocalDropzone from '../Dropzone/LocalDropzone';

const UploadJson = (props) => {
  const { localFiles, setLocalFiles, getJsonDocument } = props;
  return (
    <div className="existing-section">
      <h2>Existing Document:</h2>
      <LocalDropzone files={localFiles} setFiles={setLocalFiles} />
      {localFiles.length === 1 ? (
        <div className="uploaded-file-container">
          <div className="uploaded-file">
            <FaRegFileCode color={'#64FFDA'} />
            <div className="uplaoded-file-details">
              <span>File Name: {localFiles[0].name}</span>
              <span>
                File Size: {(localFiles[0].size / 1000000).toFixed(2)}MB
              </span>
            </div>
          </div>
          <div className="delete-uploaded-file">
            <TiDeleteOutline
              size={30}
              color="red"
              onClick={() => setLocalFiles([])}
            />
          </div>
        </div>
      ) : null}
      <div className="upload-button">
        <Button
          variant="contained"
          style={{
            backgroundColor: 'rgb(23, 42, 69)',
          }}
          onClick={getJsonDocument}
        >
          <span>Retrieve Document</span>
        </Button>
      </div>
      <div className="or-section">
        <Divider className="orDivider" />
        <span> OR</span>
        <Divider className="orDivider" />
      </div>
    </div>
  );
};

export default UploadJson;
