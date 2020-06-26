import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './App.css';

import Header from './layouts/Header/Header';
import DashboardNav from './components/DashboardNav/DashboardNav';
import Dashboard from './components/Dashboard/Dashboard';
import OverviewDashboard from './components/Dashboard/OverviewDashboard';
import Settings from './components/Settings/Settings';
import Loader from 'react-loader-spinner';

import {
  getNerSearch,
  getFileNames,
  getCorpusData,
  getUploadStatus,
  isUploadingData,
  getFileStatus,
  saveConfig,
  changeLayout,
  getLayout,
} from './reducers/editstate';

const App = (props) => {
  const {
    corpusData,
    fileNames,
    nerSearch,
    uploadStatus,
    isUploading,
    fileStatus,
    saveConfig,
    changeLayout,
    layout,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('Dashboard');
  const [currentFileName, setCurrentFileName] = useState('Overview');

  useEffect(() => {
    var title = fileNames.length > 1 ? 'Overview' : fileNames[0];
    setCurrentFileName(title);
  }, [fileNames]);

  // return fileStatus === false && uploadStatus !== 'SUCCESS' ? (
  //   <Redirect to="/upload?x=file" />
  // ) : isUploading || uploadStatus !== 'SUCCESS' ? (
  //   <div className="loader-container">
  //     <Loader type="Grid" color="#00BFFF" height={100} width={100} />
  //   </div>
  // ) :
  return (
    <div className="wrapper">
      {isLoading ? (
        <div className="settings-loader-container">
          <Loader type="Oval" color="#00BFFF" height={100} width={100} />
        </div>
      ) : null}
      <Tab.Container activeKey={key}>
        <DashboardNav setKey={setKey} />
        <Tab.Content className="main-panel">
          <Header
            currentKey={key}
            fileNames={fileNames}
            currentFileName={currentFileName}
            setCurrentFileName={setCurrentFileName}
          />

          <Tab.Pane eventKey="Dashboard" className="main-panel">
            {currentFileName === 'Overview' ? (
              <OverviewDashboard
                nerData={corpusData['Overview'].ner}
                relationData={corpusData[currentFileName].relation}
                networkData={corpusData['Overview'].network}
                sentimentData={corpusData['Overview'].sentiment}
                topicData={corpusData['Overview'].topics}
                wordCloud={corpusData['Overview'].wordcloud}
                keyData={corpusData['Overview'].keyData}
                clusterData={corpusData['Overview'].cluster}
                layout={layout['Overview']}
                changeLayout={changeLayout}
                currentFileName={currentFileName}
                setCurrentFileName={setCurrentFileName}
              />
            ) : (
              <Dashboard
                nerData={corpusData[currentFileName].ner}
                relationData={corpusData[currentFileName].relation}
                networkData={corpusData[currentFileName].network}
                sentimentData={corpusData[currentFileName].sentiment}
                topicData={corpusData[currentFileName].topics}
                summaryData={corpusData[currentFileName].summary}
                wordCloud={corpusData[currentFileName].wordcloud}
                keyData={corpusData[currentFileName].keyData}
                nerSearch={nerSearch}
                layout={layout[currentFileName]}
                changeLayout={changeLayout}
                currentFileName={currentFileName}
              />
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="Settings" className="main-panel">
            <Settings
              corpus={corpusData}
              layout={layout}
              setIsLoading={setIsLoading}
              saveConfig={saveConfig}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

const mapStateToProps = (store) => ({
  nerSearch: getNerSearch(store),
  layout: getLayout(store),
  fileStatus: getFileStatus(store),
  uploadStatus: getUploadStatus(store),
  isUploading: isUploadingData(store),
  corpusData: getCorpusData(store),
  fileNames: getFileNames(store),
});

const mapDispatchToProps = (dispatch) => ({
  saveConfig: (payload) => dispatch(saveConfig(payload)),
  changeLayout: (payload) => dispatch(changeLayout(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
