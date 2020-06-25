import { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import Button from '@material-ui/core/Button';
import OverviewNerPieChart from './OverviewNerPieChart';
import OverviewNerTable from './OverviewNerTable';
import React from 'react';

const OverviewEntityDisplay = (props) => {
  const {
    data,
    originalNetwork,
    setSelectedNode,
    selectedNerRow,
    setSelectedNerRow,
    setNetworkData,
    setCurrentFileName,
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
        <OverviewNerPieChart data={data} />
      ) : (
        <OverviewNerTable
          data={data}
          originalNetwork={originalNetwork}
          setSelectedNode={setSelectedNode}
          selectedNerRow={selectedNerRow}
          setSelectedNerRow={setSelectedNerRow}
          setNetworkData={setNetworkData}
          setCurrentFileName={setCurrentFileName}
        />
      )}
    </>
  );
};

export default OverviewEntityDisplay;
