import React, {useState, useEffect} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./upload.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { uploadingData, resetState } from "./reducers/editstate";

const Upload = props => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("")
  const {resetState} = props

  useEffect(()=> {
  resetState()
  }, [resetState])

  const handleOnChangeFile = event => {
    var file = event.target.files[0];
    setFile(file)
  }
const handleOnChangeText = event => {
  setText(String(event.target.value))
}

var redirectTo = '/dashboard?' + new Date().getTime()

const onClickHandler = () => {
  if (text !== "") {
    props.uploadingData([text, "STRING"]);
    props.history.push(redirectTo);

  } else if (file !== null) {
    props.uploadingData([file, "TXT"]);
    props.history.push(redirectTo);
  } else {
    alert("error");
  }
};

return (
  <div className="container">
  <div className="row">
    <div className="col-md-6">
      <div className='logo-container'>
        <img src='./logo.png' width='400' alt="A.L.I.C.E. logo"/>
      </div>
        <div className="form-group files">
          <label>Upload Your '.txt' File </label>
          <input
            type="file"
            className="form-control"
            multiple=""
            onChange={handleOnChangeFile}
          ></input>
        </div>
        <form noValidate autoComplete="on">
      <TextField id="text-input" variant="outlined" label="Or Copy your text here"
          // margin="auto"
          fullWidth={true}
          multiline={true}
          rowsMax={15}
          onChange={handleOnChangeText}/>
    </form>
        <div className="upload-button">
          <Button
            variant="contained"
            color="primary"
            onClick={onClickHandler}
          >
            Upload
          </Button>
        </div>

    </div>
  </div>
</div>
)
}

const mapDispatchToProps = (dispatch) => ({
  uploadingData: (payload) => dispatch(uploadingData(payload)),
  resetState: (payload) => dispatch(resetState(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(Upload));
