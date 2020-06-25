import { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import Button from '@material-ui/core/Button';
import NerPieChart from './NerPieChart';
import NerTable from './NerTable';
import React from 'react';

const EntityDisplay = (props) => {
  const {
    data,
    setSelectedNode,
    currentFileName,
    selectedNerRow,
    setSelectedNerRow,
  } = props;
  const [isPieChart, setPCorTB] = useState(true);

  const handleToggle = (event) => {
    setPCorTB(!isPieChart);
  };

  return (
    <>
      {/* <ButtonGroup color="primary" aria-label="button group" size="small">
        <Button
          onClick={() => {
            setPCorTB(true);
          }}
          variant={isPieChart ? 'contained' : 'outlined'}
        >
          Entity Breakdown
        </Button>
        <Button
          onClick={() => {
            setPCorTB(false);
          }}
          variant={isPieChart ? 'outlined' : 'contained'}
        >
          Entity Table
        </Button>
      </ButtonGroup> */}
      <FormControlLabel
        label="PieChart"
        control={
          <Switch
            color="primary"
            checked={isPieChart}
            onChange={handleToggle}
          />
        }
      />
      {isPieChart ? (
        <NerPieChart data={data} />
      ) : (
        <NerTable
          data={data}
          setSelectedNode={setSelectedNode}
          currentFileName={currentFileName}
          selectedNerRow={selectedNerRow}
          setSelectedNerRow={setSelectedNerRow}
        />
      )}
    </>
  );
};

export default EntityDisplay;
