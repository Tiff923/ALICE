import React from 'react'
import './About.css'
import Button from '@material-ui/core/Button';
import Header from '../Header/Header.js'

const About = (props) =>{

    const handleOnClick = () => {
        props.history.push("/login")
    }

    return(
    <div class="wholeThing">
        <Header></Header>

        <div class="background-image">
            <div class="position-relative overflow-hidden p-3 p-md-5 text-center">
                <div class="col-md-5 p-lg-5 mx-auto my-4">
                    <h1 class="display-2 font-weight-normal text-white">A.L.I.C.E</h1>
                    <p id="HeaderDescription" class="lead font-weight-normal text-white small px-3 mx-auto">Analyzing Language Interface Created For Everyone summarizes text documents and output informative visualization displays that quickly and easily communicate the contents of the text to the user </p>
                    <Button variant='contained' color='primary' size="large" onClick={handleOnClick}>Get Started</Button>
                </div>
            </div>
        </div>

        <div class="Features Box">
            <div class="sticky-top  sticky-top-1 py-4">
                <h1 class="text-center">Features</h1>
            </div>

            <div class="d-md-flex flex-md-equal w-100 mt-md-3 pl-md-3">
                <div class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
                    <div id="FeaturesText" class="my-3 py-3">
                        <h2 class="display-5">Classification</h2>
                        <p class="lead">Classifies documents into either of the 6 categories: Crime, Tech, Health, Finance, Terrorism, Politics</p>
                    </div>
                    <div class="bg-white shadow-sm mx-auto" ></div>
                </div>
                <div class="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"  style={{backgroundColor:"#717fcc"}}>
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5">Summarization</h2>
                        <p class="lead">Provides a short summary of the given text.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
                <div class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5 text-white">Topic Modelling</h2>
                        <p class="lead text-white">Find group of words that best represents the content of the document.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
            </div>

            <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
                <div class="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden" style={{backgroundColor:"#717fcc"}}>
                    <div id="FeaturesText" class="my-3 py-3">
                        <h2 class="display-5" style={{color:"#000000"}}>Sentiment Analysis</h2>
                        <p class="lead" style={{color:"#000000"}}>Determine if the text is positive or negative, as well as the extent of subjectivity of the text</p>
                    </div>
                    <div class="bg-light shadow-sm mx-auto" ></div>
                </div>
                <div class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5 text-white">Named Entity Recognition</h2>
                        <p class="lead text-white">Identify key words or phrases that identifies one item from a set of other items that have similar attributes.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
                <div class="mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"  style={{backgroundColor:"#717fcc"}}>
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5">Relation Extraction</h2>
                        <p class="lead">Extracting semantic relationship from text between two or more entities.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
            </div>
        </div>

        <div class="Workflow box">
            <div class="sticky-top sticky-top-2 py-4">
                <h1 class="text-center">Workflow</h1>
            </div>

            <div class="d-md-flex flex-md-equal w-100 my-md-3 pl-md-3">
                <div class="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center text-white overflow-hidden">
                    <div id="FeaturesText" class="my-3 py-3">
                        <h2 class="display-5">Classification</h2>
                        <p class="lead">Classifies documents into either of the 6 categories: Crime, Tech, Health, Finance, Terrorism, Politics</p>
                    </div>
                    <div class="bg-light shadow-sm mx-auto" ></div>
                </div>
                <div class="bg-dark mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5">Another headline</h2>
                        <p class="lead">And an even wittier subheading.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
                <div class="bg-light mr-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
                    <div id="FeaturesText" class="my-3 p-3">
                        <h2 class="display-5">Another headline</h2>
                        <p class="lead">And an even wittier subheading.</p>
                    </div>
                    <div class="bg-dark shadow-sm mx-auto" ></div>
                </div>
            </div>
        </div>

        <div class="background-image benefitsImage">
            <div class="container">
                <div class="text-white text-center pt-4">Unlock Big Data</div>
                <div class="text-white text-center pt-4">Instant Absorption of Vast Amount of Data</div>  
                <div class="text-white text-center pt-4">Interactive Dashboard</div>
            </div>
        </div>
        
    </div>
    )


}

export default About