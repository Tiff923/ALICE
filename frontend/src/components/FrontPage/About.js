import React from 'react';
import './About.css';
import Button from '@material-ui/core/Button';
import FrontPageHeader from '../FrontPageHeader/FrontPageHeader.js';

const About = (props) => {
  const handleOnClick = () => {
    props.history.push('/login');
  };

  return (
    <div className="wholeThing">
      <FrontPageHeader />

      <div className="background-image">
        <div className="position-relative overflow-hidden text-center">
          <div className="main-text col-md-5 p-lg-5 mx-auto my-4">
            <img
              src={require('../../images/logo_name.png')}
              alt="ALICE"
              className="alice-name"
            />
            {/* <h1 className="alice display-2 text-white">A.L.I.C.E</h1> */}
            <p
              id="HeaderDescription"
              className="lead font-weight-normal text-white small px-3 mx-auto"
            >
              Analyzing Language Interface Created For Everyone summarizes text
              documents and output informative visualization displays that
              quickly and easily communicate the contents of the text to the
              user{' '}
            </p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleOnClick}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <div className="Features Box">
        <div
          className="py-4 sticky-top sticky-top-1"
          style={{ color: 'white' }}
        >
          <h1 className="text-center">Features</h1>
        </div>

        <div className="d-md-flex flex-md-equal w-100 mt-md-3 pl-md-3">
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-white overflow-hidden"
            style={{ backgroundColor: '#2b4494' }}
          >
            <div id="FeaturesText" className="my-3 py-3">
              <h2 className="display-5">Classification</h2>
              <p className="lead">
                Classifies documents into either of the 6 categories: Crime,
                Tech, Health, Finance, Terrorism, Politics
              </p>
            </div>
            <div className="bg-white shadow-sm mx-auto"></div>
          </div>
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-white overflow-hidden"
            style={{ backgroundColor: '#FF8811' }}
          >
            <div id="FeaturesText" className="my-3 py-3">
              <h2 className="display-5" style={{ color: '#000000' }}>
                Summarization
              </h2>
              <p className="lead" style={{ color: '#000000' }}>
                Provides a short summary of the given text.
              </p>
            </div>
            <div className="bg-light shadow-sm mx-auto"></div>
          </div>
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 overflow-hidden"
            style={{ backgroundColor: '#2b4494' }}
          >
            <div id="FeaturesText" className="my-3 p-3">
              <h2 className="display-5 text-white">Topic Modelling</h2>
              <p className="lead text-white">
                Find group of words that best represents the content of the
                document.
              </p>
            </div>
            <div className="bg-dark shadow-sm mx-auto"></div>
          </div>
        </div>

        <div className="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-white overflow-hidden"
            style={{ backgroundColor: '#FF8811' }}
          >
            <div id="FeaturesText" className="my-3 py-3">
              <h2 className="display-5" style={{ color: '#000000' }}>
                Sentiment Analysis
              </h2>
              <p className="lead" style={{ color: '#000000' }}>
                Determine if the text is positive or negative, as well as the
                extent of subjectivity of the text
              </p>
            </div>
            <div className="bg-light shadow-sm mx-auto"></div>
          </div>
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 overflow-hidden"
            style={{ backgroundColor: '#2b4494' }}
          >
            <div id="FeaturesText" className="my-3 p-3">
              <h2 className="display-5 text-white">Named Entity Recognition</h2>
              <p className="lead text-white">
                Identify key words or phrases that identifies one item from a
                set of other items that have similar attributes.
              </p>
            </div>
            <div className="bg-dark shadow-sm mx-auto"></div>
          </div>
          <div
            className="mr-md-3 pt-3 px-3 pt-md-5 px-md-5  overflow-hidden"
            style={{ backgroundColor: '#FF8811' }}
          >
            <div id="FeaturesText" className="my-3 p-3">
              <h2 className="display-5">Relation Extraction</h2>
              <p className="lead">
                Extracting semantic relationship from text between two or more
                entities.
              </p>
            </div>
            <div className="bg-dark shadow-sm mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="Workflow box">
        <div
          className="py-4 sticky-top sticky-top-2"
          style={{ color: 'white' }}
        >
          <h1 className="text-center">Workflow</h1>
        </div>

        <div className="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
          <div className="stepOneBackground mr-md-3 pt-3 px-3 pt-md-5 px-md-5">
            <h2 className='stepLabelWhite'>Upload</h2>
          </div>
          <div className="stepTwoBackground mr-md-3 pt-3 px-3 pt-md-5 px-md-5">
            <h2 className='stepLabelBlack'>Analyze</h2>
          </div>
          <div className="stepThreeBackground mr-md-3 pt-3 px-3 pt-md-5 px-md-5">
            <h2 className='stepLabelBlack'>Save</h2>
          </div>
        </div>
      </div>

      <div className="background-image benefitsImage">
        <div className="container">
          <div className="text-white text-center pt-4">Unlock Big Data</div>
          <div className="text-white text-center pt-4">
            Instant Absorption of Vast Amount of Data
          </div>
          <div className="text-white text-center pt-4">
            Interactive Dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
