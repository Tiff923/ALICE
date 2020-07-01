import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './upload.css';
import { Row, Col } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { uploadingData, resetState } from './reducers/editstate';
import Divider from '@material-ui/core/Divider';
import { TiDeleteOutline } from 'react-icons/ti';
import DropzoneContainer from './components/Dropzone/Dropzone';
import FrontPageHeader from './components/FrontPageHeader/FrontPageHeader';
import { css, ThemeProvider } from 'styled-components';
import { base, DocumentPdf, DocumentTxt } from 'grommet-icons';
import { deepMerge } from 'grommet-icons/utils';

const customColorTheme = deepMerge(base, {
  global: {
    colors: {
      icons: '#333333',
    },
  },
  icon: {
    extend: css`
      ${(props) =>
        props.color === 'brand' &&
        `
      fill: #64FFDA;
      stroke: #64FFDA;
    `}
    `,
  },
});

const Upload = (props) => {
  const [files, setFiles] = useState([]);
  const { resetState } = props;

  useEffect(() => {
    resetState();
  }, [resetState]);

  const deleteFile = (event) => {
    setFiles(files.filter((_, i) => i !== event));
  };

  const onClickHandler = () => {
    if (files.length !== 0) {
      props.uploadingData(files);
      props.history.push('/dashboard');
    } else {
      alert('No files uploaded');
    }
  };

  console.log('Accepted', files);
  return (
    <div className="upload-container">
      <FrontPageHeader />
      <Row className="upload-row" lg={2} md={2} sm={1} xs={1}>
        <Col className="upload-column" lg={5} md={5} sm={12} xs={12}>
          <DropzoneContainer files={files} setFiles={setFiles} />

          <div className="upload-button">
            <Button
              variant="contained"
              style={{
                backgroundColor: 'rgb(23, 42, 69)',
              }}
              onClick={onClickHandler}
            >
              <span>Process Files</span>
            </Button>
          </div>
        </Col>

        <Col className="upload-column" lg={7} md={7} sm={12} xs={12}>
          <div className="uploaded-files">
            <div className="uploaded-files-header">
              <h2>Uploaded Files</h2>
              <div className="uploaded-files-subheader">
                <span>{files.length} Files</span>
                <span>
                  {(
                    files.reduce((acc, e) => acc + e.size, 0.0) / 1000000
                  ).toFixed(2)}{' '}
                  MB
                </span>
              </div>
            </div>
            <Divider className="divider" />

            {files.map((file, index) => {
              return (
                <div className="uploaded-file-container" key={index}>
                  <div className="uploaded-file">
                    <ThemeProvider theme={customColorTheme}>
                      {file.name.substring(
                        file.name.lastIndexOf('.') + 1,
                        file.name.length
                      ) === 'pdf' ? (
                        <DocumentPdf color="brand" />
                      ) : (
                        <DocumentTxt color="brand" />
                      )}
                    </ThemeProvider>
                    <div className="uplaoded-file-details">
                      <span>File Name: {file.name}</span>
                      <span>
                        File Size: {(file.size / 1000000).toFixed(2)}MB
                      </span>
                    </div>
                  </div>
                  <div className="delete-uploaded-file">
                    <TiDeleteOutline
                      size={30}
                      color="red"
                      onClick={() => deleteFile(index)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
  resetState: (payload) => dispatch(resetState(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(Upload));
