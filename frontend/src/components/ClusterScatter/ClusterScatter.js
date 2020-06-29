import React from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

const ClusterScatter = (props) => {
  const { dataPoints, labels, topic_all_cluster, fileNames } = props.data;

  const x = [];
  const y = [];
  dataPoints.forEach((point) => {
    x.push(point[0]);
    y.push(point[1]);
  });

  const index_all_clusters = () => {
    var clusters = Array.from(new Set(labels));
    clusters = clusters.sort();
    var clusters_index = [];
    clusters.forEach((cluster) => {
      var cluster_index = [];
      labels.forEach((item, index) => {
        if (item === cluster) {
          cluster_index.push(index);
        }
      });
      clusters_index.push(cluster_index);
    });
    return clusters_index;
  };

  const format_per_category = (cluster_index) => {
    var temp = [];
    cluster_index.forEach((index) => {
      temp.push({
        filename: fileNames[index],
        x: x[index],
        y: y[index],
      });
    });

    return temp;
  };

  const output = (clusters_index) => {
    var arr = [];
    clusters_index.forEach((cluster_index, index) => {
      var d = {};
      const temp = format_per_category(cluster_index);
      d['data'] = temp;
      d['id'] = topic_all_cluster[index];
      arr.push(d);
    });
    return arr;
  };

  var data = output(index_all_clusters());

  var annotations = [];
  var i = 0;
  data.forEach((cluster, index) => {
    cluster['data'].forEach((point, loc) => {
      annotations.push({
        type: 'circle',
        match: { index: i + loc },
        noteX: 10,
        noteY: 10,
        offset: 3,
        noteTextOffset: -3,
        noteWidth: 10,
        note: point.filename,
      });
    });
    i = i + cluster.data.length;
  });

  return (
    <ResponsiveScatterPlot
      data={data}
      margin={{ top: 60, right: 60, bottom: 70, left: 100 }}
      xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
      nodeSize={15}
      blendMode="multiply"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'word_embedding_x',
        legendPosition: 'middle',
        legendOffset: 46,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'word_embedding_y',
        legendPosition: 'middle',
        legendOffset: -60,
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'column',
          justify: false,
          margin: { bottom: 20 },
          // translateX: 130,
          // translateY: 90,
          itemWidth: 100,
          itemHeight: 12,
          itemsSpacing: 5,
          itemDirection: 'left-to-right',
          symbolSize: 12,
          symbolShape: 'circle',
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
      annotations={annotations}
      tooltip={({ node }) => (
        <div
          style={{
            color: node.style.color,
            background: '#333',
            padding: '12px 16px',
          }}
        >
          <strong>{node.data.serieId}</strong>
        </div>
      )}
    />
  );
};

export default ClusterScatter;
