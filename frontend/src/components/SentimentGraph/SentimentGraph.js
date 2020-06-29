import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const barGraphProps = {
  padding: 0.2,
  labelSkipWidth: 16,
  labelSkipHeight: 16,
  minValue: -100,
  maxValue: 100,
  enableGridX: true,
  enableGridY: false,
  label: (d) => Math.abs(d.value.toFixed(2)),
  labelTextColor: 'inherit:darker(1.2)',
  axisTop: {
    tickSize: 0,
    tickPadding: 12,
  },
  axisBottom: {
    // legend: 'Sentiments',
    legendPosition: 'middle',
    legendOffset: 50,
    tickSize: 0,
    tickPadding: 12,
  },
  axisLeft: null,
  axisRight: {
    format: (v) => `${Math.abs(v)}%`,
  },
  markers: [
    {
      axis: 'y',
      value: 0,
      lineStyle: { strokeOpacity: 0 },
      textStyle: { fill: '#2ebca6' },
      legend: 'positive',
      legendPosition: 'top-left',
      legendOrientation: 'vertical',
      legendOffsetY: 120,
    },
    {
      axis: 'y',
      value: 0,
      lineStyle: { stroke: '#f47560', strokeWidth: 1 },
      textStyle: { fill: '#e25c3b' },
      legend: 'negative',
      legendPosition: 'bottom-left',
      legendOrientation: 'vertical',
      legendOffsetY: 120,
    },
  ],
};

const SentimentGraph = ({ data /* see data tab */ }) => (
  <ResponsiveBar
    {...barGraphProps}
    data={data}
    keys={['positivity', 'negativity', 'subjectivity']}
    indexBy="sentiment"
    margin={{ top: 50, right: 40, bottom: 70, left: 0 }}
    padding={0.3}
    colors={['#97e3d5', '#f47560', 'hsl(49, 70%, 50%)']}
    labelFormat={(v) => `${v.toFixed(2)}%`}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 30,
        translateY: 70,
        itemsSpacing: 0,
        itemWidth: 85,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 10,
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    tooltip={({ id, value, color }) => (
      <strong style={{ color }}>{`${value.toFixed(2)}%`}</strong>
    )}
  />
);

export default SentimentGraph;
