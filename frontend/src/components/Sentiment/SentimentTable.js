import React from 'react';
import { connect } from 'react-redux';
import Table from '../../layouts/Header/Table/Table';
import { MdCloudUpload } from 'react-icons/md';
import { updateSentimentWordcloud } from '../../reducers/editstate';
import { sentimentcolors } from '../../utils/colors';
import SentimentHighlight from './SentimentHighlight';

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
    { title: 'Sentences', field: 'sentences', hidden: true },
  ];

  const detailPanel = (rowData) => {
    return (
      <>
        {rowData.sentences.Positive.length > 0 ? (
          <div style={{ padding: 5 }}>
            <span style={{ fontWeight: 'bold' }}>Positive sentences: </span>
            {rowData.sentences.Positive.map((sentence, i) => {
              return (
                <SentimentHighlight
                  key={i}
                  sentence={sentence}
                  sentiment={'Positive'}
                  entity={rowData.aspect}
                />
              );
            })}
          </div>
        ) : null}

        {rowData.sentences.Negative.length > 0 ? (
          <div style={{ padding: 5 }}>
            <span style={{ fontWeight: 'bold' }}>Negative sentences: </span>
            {rowData.sentences.Negative.map((sentence, i) => {
              return (
                <SentimentHighlight
                  key={i}
                  sentence={sentence}
                  sentiment={'Negative'}
                  entity={rowData.aspect}
                />
              );
            })}
          </div>
        ) : null}

        {rowData.sentences.Neutral.length > 0 ? (
          <div style={{ padding: 5 }}>
            <span style={{ fontWeight: 'bold' }}>Neutral sentences: </span>
            {rowData.sentences.Neutral.map((sentence, i) => {
              return (
                <SentimentHighlight
                  key={i}
                  sentence={sentence}
                  sentiment={'Neutral'}
                  entity={rowData.aspect}
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
          props.updateSentimentWordcloud({
            data: tableData,
            currentFileName: currentFileName,
          });
        }
      },
    },
  ];

 const onSelectionChange = (rows) => {
    for (var i = 0; i < rows.length; i++) {
      rows[i].tableData.checked = false;
    }
    console.log(rows)
 }

  return (
    <Table
      data={data}
      columns={columns}
      options={options}
      detailPanel={detailPanel}
      tableRef={tableRef}
      onSelectionChange={onSelectionChange}
      actions={actions}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateSentimentWordcloud: (payload) =>
    dispatch(updateSentimentWordcloud(payload)),
});

export default connect(null, mapDispatchToProps)(SentimentTable);
