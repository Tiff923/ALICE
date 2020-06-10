const largeLayout = [
  { i: 'key-data-1', x: 0, y: 0, w: 3, h: 4 },
  { i: 'key-data-2', x: 3, y: 0, w: 3, h: 4 },
  { i: 'key-data-3', x: 6, y: 0, w: 3, h: 4 },
  { i: 'key-data-4', x: 9, y: 0, w: 3, h: 4 },
  { i: 'summary', x: 0, y: 4, w: 12, h: 6 },
  { i: 'topic-modelling', x: 0, y: 10, w: 4, h: 12 },
  { i: 'word-cloud', x: 4, y: 10, w: 4, h: 12 },
  { i: 'sentiment-graph', x: 8, y: 10, w: 4, h: 12 },
  { i: 'ner-text', x: 0, y: 22, w: 7, h: 12 },
  { i: 'ner-table', x: 7, y: 22, w: 5, h: 12 },
  { i: 'relation-table', x: 0, y: 44, w: 5, h: 16 },
  { i: 'network-graph', x: 5, y: 44, w: 7, h: 16 },
];

const medLayout = [
  { i: 'key-data-1', x: 0, y: 0, w: 3, h: 4 },
  { i: 'key-data-2', x: 3, y: 0, w: 3, h: 4 },
  { i: 'key-data-3', x: 6, y: 0, w: 3, h: 4 },
  { i: 'key-data-4', x: 9, y: 0, w: 3, h: 4 },
  { i: 'summary', x: 0, y: 4, w: 12, h: 6 },
  { i: 'topic-modelling', x: 0, y: 10, w: 4, h: 12 },
  { i: 'word-cloud', x: 4, y: 10, w: 4, h: 12 },
  { i: 'sentiment-graph', x: 8, y: 10, w: 4, h: 12 },
  { i: 'ner-text', x: 0, y: 22, w: 7, h: 12 },
  { i: 'ner-table', x: 7, y: 22, w: 5, h: 12 },
  { i: 'relation-table', x: 0, y: 44, w: 5, h: 16 },
  { i: 'network-graph', x: 5, y: 44, w: 7, h: 16 },
];

const smallLayout = [
  { i: 'key-data-1', x: 0, y: 0, w: 3, h: 4 },
  { i: 'key-data-2', x: 3, y: 0, w: 3, h: 4 },
  { i: 'key-data-3', x: 0, y: 4, w: 3, h: 4 },
  { i: 'key-data-4', x: 3, y: 4, w: 3, h: 4 },
  { i: 'summary', x: 0, y: 9, w: 6, h: 6 },
  { i: 'topic-modelling', x: 0, y: 15, w: 3, h: 12 },
  { i: 'word-cloud', x: 3, y: 15, w: 3, h: 12 },
  { i: 'sentiment-graph', x: 0, y: 27, w: 3, h: 12 },
  { i: 'ner-table', x: 3, y: 27, w: 3, h: 12 },
  { i: 'ner-text', x: 0, y: 39, w: 6, h: 12 },
  { i: 'network-graph', x: 0, y: 51, w: 6, h: 12 },
  { i: 'relation-table', x: 0, y: 63, w: 6, h: 16 },
];

const xSmallLayout = [
  { i: 'key-data-1', x: 0, y: 0, w: 3, h: 4 },
  { i: 'key-data-2', x: 0, y: 4, w: 3, h: 4 },
  { i: 'key-data-3', x: 0, y: 8, w: 3, h: 4 },
  { i: 'key-data-4', x: 0, y: 12, w: 3, h: 4 },
  { i: 'summary', x: 0, y: 16, w: 3, h: 10 },
  { i: 'topic-modelling', x: 0, y: 26, w: 3, h: 12 },
  { i: 'word-cloud', x: 0, y: 38, w: 3, h: 12 },
  { i: 'sentiment-graph', x: 0, y: 50, w: 3, h: 12 },
  { i: 'ner-table', x: 0, y: 62, w: 3, h: 12 },
  { i: 'ner-text', x: 0, y: 74, w: 3, h: 12 },
  { i: 'network-graph', x: 0, y: 86, w: 3, h: 12 },
  { i: 'relation-table', x: 0, y: 98, w: 3, h: 16 },
];

const xsSmallLayout = [
  { i: 'key-data-1', x: 0, y: 0, w: 2, h: 4 },
  { i: 'key-data-2', x: 0, y: 4, w: 2, h: 4 },
  { i: 'key-data-3', x: 0, y: 8, w: 2, h: 4 },
  { i: 'key-data-4', x: 0, y: 12, w: 2, h: 4 },
  { i: 'summary', x: 0, y: 16, w: 2, h: 10 },
  { i: 'topic-modelling', x: 0, y: 26, w: 2, h: 12 },
  { i: 'word-cloud', x: 0, y: 38, w: 2, h: 12 },
  { i: 'sentiment-graph', x: 0, y: 50, w: 2, h: 12 },
  { i: 'ner-table', x: 0, y: 62, w: 2, h: 12 },
  { i: 'ner-text', x: 0, y: 74, w: 2, h: 12 },
  { i: 'network-graph', x: 0, y: 86, w: 2, h: 12 },
  { i: 'relation-table', x: 0, y: 98, w: 2, h: 16 },
];

export const initialLayout = {
  lg: largeLayout,
  md: medLayout,
  sm: smallLayout,
  xs: xSmallLayout,
  xxs: xsSmallLayout,
};
