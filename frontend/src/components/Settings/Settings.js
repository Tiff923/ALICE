import React from 'react';
import { Container } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import { MdSave } from 'react-icons/md';
import './settings.css';
import axios from 'axios';

const Settings = (props) => {
  const { setIsLoading, layout, corpus, saveConfig } = props;

  const [topic, setTopic] = React.useState(10);

  const saveToDb = async () => {
    setIsLoading(true);
    const data = {
      corpus: corpus,
      layout: layout,
    };
    await axios
      .post('http://5370737854fd.ngrok.io/saveConfig', {
        data: data,
      })
      .then((res) => {
        saveConfig(res.data);
        setIsLoading(false);
      });
  };

  return (
    <Container id="settings-container" fluid>
      <div className="settings-button">
        <Button onClick={() => saveToDb()}>
          <MdSave size={30} />
        </Button>
        Save
      </div>
      <div className="settings-button">
        <FormControl>
          <InputLabel id="topic-select">Number of Topics</InputLabel>
          <Select
            labelId="topic-select-label"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
          <FormHelperText>
            Number of words per topic (topic modelling)
          </FormHelperText>
        </FormControl>
      </div>
    </Container>
  );
};

export default Settings;
