import React from 'react'
import './upload.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import axios from 'axios'


class upload extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            uploadedFile: null,
            uploadedText: ""
        }
    }

    handleOnChangeFile=event=>{
        var file = event.target.files[0]
        this.setState({
            uploadedFile: file
        })
    }

    handleOnChangeText = event => {
        this.setState({
            uploadedText: String(event.target.value)
        })
    }

    onClickHandler = () => {
        if (this.state.uploadedText != "") {
            axios.post("http://localhost:5000/uploadText", {request:"textUpload",
                data: this.state.uploadedText}).then(res => {

                })
            console.log(this.state.uploadedText)
        }
        else if (this.state.uploadedFile != null) {
            var formData = new FormData()
            formData.append('file', this.state.uploadedFile)
            axios.post("http://localhost:5000/uploadFile", formData).then(res => {
                
            })
            console.log("file")
        }
        else {
            alert("Error")
        }
    }

    render() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <form method="post" action="#" id="#">
                            <div class="form-group files">
                                <label>Upload Your '.txt' File </label>
                                <input type="file" class="form-control" multiple="" 
                                onChange={this.handleOnChangeFile}
                                ></input>
                            </div>
                            <TextField  id="text-input"
                                        label="Or Copy your text here"
                                        margin="auto"
                                        fullWidth="true"
                                        multiline="true"
                                        rowsMax="15"
                                        onChange={this.handleOnChangeText}
                                        >
                            </TextField>
                            <div class="upload-button">
                                <Button variant="contained" 
                                color="primary"
                                onClick={this.onClickHandler}>
                                    Upload</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> 
        )
    }
}

export default upload