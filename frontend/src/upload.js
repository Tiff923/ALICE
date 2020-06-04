import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./upload.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { uploadingData } from "./reducers/editstate";

const fs = require("fs");

class upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFile: null,
      uploadedText: "",
    };
  }

  handleOnChangeFile = (event) => {
    var file = event.target.files[0];
    this.setState({
      uploadedFile: file,
    });
  };

  handleOnChangeText = (event) => {
    this.setState({
      uploadedText: String(event.target.value),
    });
  };

  onClickHandler = () => {
    if (this.state.uploadedText !== "") {
      this.props.uploadingData(this.state.uploadedText);
      this.props.history.push("/dashboard");
    } else if (this.state.uploadedFile !== null) {
      fs.readFile(this.state.uploadedFile, "utf-8", (err, data) => {
        if (err) {
          throw err;
        } else {
          var text = data.toString();
          this.props.uploadingData(text);
        }
      });
      this.props.history.push("/dashboard");
    } else {
      alert("error");
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <form method="post" action="#" id="#">
              <div className="form-group files">
                <label>Upload Your '.txt' File </label>
                <input
                  type="file"
                  className="form-control"
                  multiple=""
                  onChange={this.handleOnChangeFile}
                ></input>
              </div>
              <TextField
                id="text-input"
                label="Or Copy your text here"
                margin="auto"
                fullWidth="true"
                multiline="true"
                rowsMax="15"
                onChange={this.handleOnChangeText}
              ></TextField>
              <div className="upload-button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onClickHandler}
                >
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(upload));
