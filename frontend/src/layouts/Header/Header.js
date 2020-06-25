import React from 'react';
import './header.css';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const Header = (props) => {
  const { currentKey, fileNames, currentFileName, setCurrentFileName } = props;

  return (
    <div className="header-container">
      <div className="header-text">
        <span>{currentKey}</span>
      </div>
      <FormControl>
        <InputLabel id="topic-select">Documents</InputLabel>
        <Select
          labelId="topic-select-label"
          value={currentFileName}
          onChange={(event) => setCurrentFileName(event.target.value)}
        >
          {fileNames.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>PLACEHOLDER</FormHelperText>
      </FormControl>
    </div>
  );
};

export default Header;
