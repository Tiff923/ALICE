import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

const PrettoSlider = withStyles({
  root: {
    // color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    backgroundColor: 'black',
    height: 8,
    width: 1,
  },
})(Slider);

const NetworkGraphHeader = (props) => {
  const {
    isFullScreen,
    handleFullScreen,
    handleNetworkToggle,
    is2D,
    linkDistance,
    setLinkDistance,
    chargeStrength,
    setChargeStrength,
    cooldownTicks,
    handleFreeze,
  } = props;
  return (
    <>
      <div className="options-container">
        <FormControlLabel
          label="3D"
          control={
            <Switch
              color="primary"
              checked={!is2D}
              onChange={handleNetworkToggle}
            />
          }
        />
        <FormControlLabel
          label="Fullscreen"
          control={
            <Switch
              color="primary"
              checked={isFullScreen}
              onChange={handleFullScreen}
            />
          }
        />
        <FormControlLabel
          label="Freeze"
          control={
            <Switch
              color="primary"
              checked={cooldownTicks === 0}
              onChange={handleFreeze}
            />
          }
        />
      </div>
      <div className="options-container">
        <span style={{ width: '15%' }}>Link Distance</span>
        <PrettoSlider
          defaultValue={linkDistance}
          // value={linkDistance}
          onChangeCommitted={(event, value) => setLinkDistance(value)}
          aria-labelledby="distance-slider"
          valueLabelDisplay="auto"
          step={100}
          marks
          min={0}
          max={1000}
        />
      </div>
      <div className="options-container">
        <span style={{ width: '15%' }}>Charge Strength</span>
        <PrettoSlider
          defaultValue={chargeStrength}
          // value={chargeStrength}
          onChangeCommitted={(event, value) => setChargeStrength(value)}
          aria-labelledby="charge-slider"
          valueLabelDisplay="auto"
          step={100}
          marks
          min={-1000}
          max={0}
        />
      </div>
    </>
  );
};

export default NetworkGraphHeader;
