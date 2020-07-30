import React from 'react';
import { connect } from 'react-redux';
import Table from '../../layouts/Header/Table/Table';
import Chip from '@material-ui/core/Chip';
import { MdCloudUpload } from 'react-icons/md';
import { updateSentimentWordcloud } from '../../reducers/editstate';
import { sentimentcolors } from '../../utils/colors';

const OverviewSentimentTable = (props) => {
  const {
    currentFileName,
    setSentimentEntity,
    setCurrentFileName,
    sentimentWordDocument,
    data,
  } = props;
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
    { title: 'Chapter', field: 'chapters', hidden: true },
  ];

  const detailPanel = (rowData) => {
    return (
      <>
        {rowData.chapters.Positive ? (
          <div style={{ padding: 5 }}>
            <span>Positive: </span>
            {rowData.chapters.Positive.map((e) => {
              return (
                <Chip
                  key={e}
                  style={{ margin: 2 }}
                  label={e}
                  color="#B0DB43"
                  onClick={() => setCurrentFileName(e)}
                />
              );
            })}
          </div>
        ) : null}
        {rowData.chapters.Negative ? (
          <div style={{ padding: 5 }}>
            <span>Negative: </span>
            {rowData.chapters.Negative.map((e) => {
              return (
                <Chip
                  key={e}
                  style={{ margin: 2 }}
                  label={e}
                  color="#FC2F00"
                  onClick={() => setCurrentFileName(e)}
                />
              );
            })}
          </div>
        ) : null}
        {rowData.chapters.Neutral ? (
          <div style={{ padding: 5 }}>
            <span>Neutral: </span>
            {rowData.chapters.Neutral.map((e) => {
              return (
                <Chip
                  key={e}
                  style={{ margin: 2 }}
                  label={e}
                  color="#80CED7"
                  onClick={() => setCurrentFileName(e)}
                />
              );
            })}
          </div>
        ) : null}
      </>
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
          const newData = {};
          newData[entitySelected] = sentimentWordDocument[entitySelected];
          props.updateSentimentWordcloud({
            data: newData,
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

export default connect(null, mapDispatchToProps)(OverviewSentimentTable);
