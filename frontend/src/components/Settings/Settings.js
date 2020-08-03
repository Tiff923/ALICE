import React from 'react';
import { Container } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { MdSave } from 'react-icons/md';
import './settings.css';
import axios from 'axios';

const Settings = (props) => {
  const {
    setIsLoading,
    layout,
    corpusData,
    saveDocumentId,
    documentId,
    fileNames,
  } = props;

  const saveToDb = async () => {
    setIsLoading(true);
    const data = {
      fileNames: fileNames,
      corpusData: corpusData,
      layout: layout,
    };
    await axios
      .post('http://localhost:5000/saveToDb', {
        data: data,
      })
      .then((res) => {
        saveDocumentId(res.data);
        setIsLoading(false);
      });
  };

  const saveToLocal = () => {
    setIsLoading(true);

    const toSaveCorpusData = JSON.parse(JSON.stringify(corpusData));

    fileNames.forEach((document) => {
      if (toSaveCorpusData[document].network.links[0].source.id) {
        toSaveCorpusData[document].network.links.forEach((link) => {
          link.source = link.source.id;
          link.target = link.target.id;
          delete link.__indexColor;
          delete link.__controlPoints;
          delete link.__photons;
          delete link.index;
        });

        toSaveCorpusData[document].network.nodes.forEach((node) => {
          delete node.index;
          delete node.x;
          delete node.y;
          delete node.vx;
          delete node.vy;
          delete node.__indexColor;
        });
      }
    });

    const data = {
      fileNames: fileNames,
      corpusData: toSaveCorpusData,
      layout: layout,
    };

    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    var json = JSON.stringify(data),
      blob = new Blob([json], { type: 'octet/stream' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'test.json';
    a.click();
    window.URL.revokeObjectURL(url);

    setIsLoading(false);
  };

  return (
    <Container id="settings-container" fluid>
      <div className="settings-button">
        <Button onClick={() => saveToDb()}>
          <MdSave size={30} />
        </Button>
        Save to Database
      </div>
      {documentId ? <h2>Case ID: {documentId}</h2> : null}

      <div className="settings-button">
        <Button onClick={() => saveToLocal()}>
          <MdSave size={30} />
        </Button>
        Save JSON
      </div>
    </Container>
  );
};

export default Settings;
