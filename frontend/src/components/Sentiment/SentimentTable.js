import React from 'react';
import { connect } from 'react-redux';
import Table from '../../layouts/Header/Table/Table';
import { MdCloudUpload } from 'react-icons/md';
import { updateSentimentWordcloud } from '../../reducers/editstate';
import { sentimentcolors } from '../../utils/colors';

const SentimentTable = (props) => {
  const { currentFileName, setSentimentEntity, data } = props;
  const tableRef = React.useRef();

  const columns = [
    { title: 'Entity', field: 'aspect', editable: 'never' },
    {
      title: 'Sentiment',
      field: 'sentiment',
      editable: 'never',
      lookup: {
        Negative: 'Negative',
        Neutral: 'Neutral',
        Positive: 'Positive',
      },
      cellStyle: (rowData) => ({
        background: `${sentimentcolors[rowData]}90`,
        borderColor: `${sentimentcolors[rowData]}`,
      }),
    },
    { title: 'Sentence', field: 'sentence', hidden: true },
  ];

  const detailPanel = (rowData) => {
    return (
      <div style={{ padding: 5 }}>
        <span>Sentence: </span>
        <span>{rowData.sentence}</span>
      </div>
    );
  };

  const options = {
    showTitle: false,
    filtering: true,
    search: true,
    selection: true,
  };

  const actions = [
    {
      tooltip: 'Generate sentiment wordcloud',
      icon: () => <MdCloudUpload color="rgb(255, 136, 17)" />,
      onClick: (evt, tableData) => {
        const data = new Set();
        tableData.forEach((e) => data.add(e.aspect));
        if (data.size !== 1) {
          alert('Select only one entity!');
        } else {
          const entitySelected = data.values().next().value;
          setSentimentEntity(entitySelected);
          props.updateSentimentWordcloud({
            data: tableData,
            currentFileName: currentFileName,
          });
        }
      },
    },
  ];
  return (
    <Table
      data={data}
      columns={columns}
      options={options}
      detailPanel={detailPanel}
      tableRef={tableRef}
      actions={actions}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateSentimentWordcloud: (payload) =>
    dispatch(updateSentimentWordcloud(payload)),
});

export default connect(null, mapDispatchToProps)(SentimentTable);
