import React from 'react';
import './upload.css';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: 'rgb(23, 42, 69)',
    borderRadius: 4,
  },
  textFieldInput: {
    color: 'rgb(168, 178, 209)',
    fontFamily: 'Poppins, sans-serif',
  },
  textFieldLabel: {
    color: 'rgb(168, 178, 209)',
    fontFamily: 'Poppins, sans-serif',
  },
}));

const UploadDB = (props) => {
  const { text, handleTextChange, getDbDocument } = props;

  const classes = useStyles();
  return (
    <div className="existing-section">
      <h2>Database Document:</h2>
      <TextField
        value={text}
        onChange={handleTextChange}
        id="outlined-full-width"
        label="Enter Document ID"
        InputLabelProps={{
          className: classes.textFieldLabel,
        }}
        InputProps={{
          className: classes.textFieldInput,
        }}
        className={classes.textField}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <div className="upload-button">
        <Button
          variant="contained"
          style={{
            backgroundColor: 'rgb(23, 42, 69)',
          }}
          onClick={getDbDocument}
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

export default UploadDB;
