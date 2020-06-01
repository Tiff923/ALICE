import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withResizeDetector } from 'react-resize-detector';
import { getSelectedNode, getSelectedLink } from '../../reducers/editstate';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TwoDGraph from './TwoDGraph';
import ThreeDGraph from './ThreeDGraph';
import Fullscreen from 'react-full-screen';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import $ from 'jquery';

const NetworkGraph = (props) => {
  const { data, selectedNode, selectedLink } = props;
  const [is3D, set2Dor3D] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const fsRef = React.useRef(null);

  const handleToggle = (event) => {
    set2Dor3D(!is3D);
  };

  const handleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Fullscreen ref={fsRef} enabled={fullScreen}>
        <FormControlLabel
          label="3D"
          control={<Switch checked={is3D} onChange={handleToggle} />}
        />
        {fullScreen ? (
          <MdFullscreenExit
            style={{
              position: 'absolute',
              right: 15,
              top: 110,
              backgroundColor: 'rgb(255,255,255, 0.6)',
              zIndex: 999,
              cursor: 'pointer',
            }}
            size={30}
            onClick={handleFullScreen}
          />
        ) : (
          <MdFullscreen
            style={{
              position: 'absolute',
              right: 15,
              top: 110,
              backgroundColor: 'rgb(255,255,255, 0.6)',
              zIndex: 999,
              cursor: 'pointer',
            }}
            size={30}
            onClick={handleFullScreen}
          />
        )}
        {is3D ? (
          <ThreeDGraph
            height={
              fullScreen
                ? $(window).height()
                : $('#networkGraph').height() - 115
            }
            width={
              fullScreen ? $(window).width() : $('#networkGraph').width() - 30
            }
            data={data}
            selectedNode={selectedNode}
            selectedLink={selectedLink}
          />
        ) : (
          <TwoDGraph
            height={
              fullScreen
                ? $(window).height()
                : $('#networkGraph').height() - 115
            }
            width={
              fullScreen ? $(window).width() : $('#networkGraph').width() - 30
            }
            data={data}
            selectedNode={selectedNode}
            selectedLink={selectedLink}
          />
        )}
      </Fullscreen>
    </div>
  );
};

const mapStateToProps = (store) => ({
  selectedNode: getSelectedNode(store),
  selectedLink: getSelectedLink(store),
});

export default connect(
  mapStateToProps,
  null
)(withResizeDetector(React.memo(NetworkGraph)));
