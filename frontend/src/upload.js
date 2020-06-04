import React, {useState} from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "./upload.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { uploadingData } from "./reducers/editstate";

const Upload = props => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("")

  const handleOnChangeFile = event => {
    var file = event.target.files[0];
    setFile(file)
  }
const handleOnChangeText = event => {
  setText(String(event.target.value))
}

const onClickHandler = () => {
  if (text !== "") {
    props.uploadingData([text, "STRING"]);
    props.history.push("/dashboard");

  } else if (file !== null) {
    props.uploadingData([file, "TXT"]);
    props.history.push("/dashboard");
  } else {
    alert("error");
  }
};

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
            onChange={handleOnChangeFile}
          ></input>
        </div>
        <TextField
          id="text-input"
          label="Or Copy your text here"
          margin="auto"
          fullWidth="true"
          multiline="true"
          rowsMax="15"
          onChange={handleOnChangeText}
        ></TextField>
        <div className="upload-button">
          <Button
            variant="contained"
            color="primary"
            onClick={onClickHandler}
          >
            Upload
          </Button>
        </div>
      </form>
    </div>
  </div>
</div>
)
}



const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(Upload));
