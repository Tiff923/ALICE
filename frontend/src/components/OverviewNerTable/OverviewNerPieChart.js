import { ResponsivePie } from '@nivo/pie';
import React from 'react';

const compareValues = (a, b) => {
  let res = 0;
  if (a.value < b.value) {
    res = 1;
  } else if (a.value > b.value) {
    res = -1;
  }
  return res;
};

const OverviewNerPieChart = (props) => {
  const counter = (nerData) => {
    nerData.sort(compareValues);
    var res = nerData.slice(0, 10);
    return res;
  };

  const getColor = (filteredArr) => {
    var colors = [];
    filteredArr.map((e) => colors.push(e.color));
    return colors;
  };

  return (
    <ResponsivePie
      data={counter(props.data)}
      margin={{ top: 0, right: 80, bottom: 60, left: 80 }}
      innerRadius={0.45}
      colors={getColor(counter(props.data))}
      radialLabelsLinkHorizontalLength={10}
      radialLabelsLinkDiagonalLength={8}
    />
  );
};

export default OverviewNerPieChart;
