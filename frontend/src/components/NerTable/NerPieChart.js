import { ResponsivePie } from '@nivo/pie';
import { nercolors } from '../../utils/colors';
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

const NerPieChart = (props) => {
  const counter = (nerData) => {
    var count = {};
    nerData.forEach((element) => {
      var key = element['text'];
      if (key in count) {
        count[key].value += 1;
      } else {
        count[key] = {
          id: key,
          label: key,
          value: 1,
          color: nercolors[element['type']],
        };
      }
    });

    var countArr = Object.values(count);
    countArr.sort(compareValues);
    var filteredArr = countArr.slice(0, 10);
    return filteredArr;
  };

  const getColor = (filteredArr) => {
    var colors = [];
    filteredArr.map((e) => colors.push(e.color));
    return colors;
  };

  return (
    <ResponsivePie
      data={counter(props.data.ents)}
      margin={{ top: 0, right: 80, bottom: 60, left: 80 }}
      innerRadius={0.45}
      colors={getColor(counter(props.data.ents))}
      radialLabelsLinkHorizontalLength={10}
      radialLabelsLinkDiagonalLength={8}
    />
  );
};

export default NerPieChart;
