import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import Table from '../../layouts/Header/Table/Table';
import { updateRelation } from '../../reducers/editstate';

const OverviewRelationTable = (props) => {
  const {
    data,
    setSelectedLink,
    selectedRelationRow,
    setSelectedRelationRow,
    setCurrentFileName,
  } = props;

  useEffect(() => {
    setSelectedRelationRow(null);
    setSelectedLink(null);
  }, [data]);

  const columns = [
    { title: 'Entity 1', field: 'e1', editable: 'never' },
    { title: 'Entity 1 Type', field: 'e1_label', editable: 'never' },
    { title: 'Entity 2', field: 'e2', editable: 'never' },
    { title: 'Entity 2 Type', field: 'e2_label', editable: 'never' },
    { title: 'Documents', field: 'documents', hidden: true },
    { title: 'Relation Type', field: 'relation', editable: 'never' },
    // {
    //   title: 'Relation Type',
    //   field: 'relation',
    //   lookup: {
    //     'Cause-Effect(e1,e2)': 'Cause-Effect(e1,e2)',
    //     'Cause-Effect(e2,e1)': 'Cause-Effect(e2,e1)',
    //     'Component-Whole(e1,e2)': 'Component-Whole(e1,e2)',
    //     'Component-Whole(e2,e1)': 'Component-Whole(e2,e1)',
    //     'Content-Container(e1,e2)': 'Content-Container(e1,e2)',
    //     'Content-Container(e2,e1)': 'Content-Container(e2,e1)',
    //     'Entity-Destination(e1,e2)': 'Entity-Destination(e1,e2)',
    //     'Entity-Destination(e2,e1)': 'Entity-Destination(e2,e1)',
    //     'Entity-Origin(e1,e2)': 'Entity-Origin(e1,e2)',
    //     'Entity-Origin(e2,e1)': 'Entity-Origin(e2,e1)',
    //     'Instrument-Agency(e1,e2)': 'Instrument-Agency(e1,e2)',
    //     'Instrument-Agency(e2,e1)': 'Instrument-Agency(e2,e1)',
    //     'Member-Collection(e1,e2)': 'Member-Collection(e1,e2)',
    //     'Member-Collection(e2,e1)': 'Member-Collection(e2,e1)',
    //     'Message-Topic(e1,e2)': 'Message-Topic(e1,e2)',
    //     'Message-Topic(e2,e1)': 'Message-Topic(e2,e1)',
    //     'Product-Producer(e1,e2)': 'Product-Producer(e1,e2)',
    //     'Product-Producer(e2,e1)': 'Product-Producer(e2,e1)',
    //     Other: 'Other',
    //   },
    // },
  ];

  const onRowClick = (evt, row) => {
    if (selectedRelationRow === row.tableData.id) {
      setSelectedRelationRow(null);
      setSelectedLink(null);
    } else {
      setSelectedRelationRow(row.tableData.id);
      if (row.relation.slice(-7) === '(e2,e1)') {
        setSelectedLink({
          source: row.e2 + '_' + row.e2_label,
          target: row.e1 + '_' + row.e1_label,
        });
      } else {
        setSelectedLink({
          source: row.e1 + '_' + row.e1_label,
          target: row.e2 + '_' + row.e2_label,
        });
      }
    }
  };

  const options = {
    showTitle: false,
    filtering: true,
    search: true,
    rowStyle: (rowData) => ({
      backgroundColor:
        selectedRelationRow === rowData.tableData.id ? '#EEE' : '#FFF',
    }),
  };

  const detailPanel = (rowData) => {
    return (
      <div style={{ padding: 5 }}>
        <span>Found in: </span>
        {rowData.documents.map((e) => {
          return (
            <Chip
              key={e}
              style={{ margin: 2 }}
              label={e}
              color="primary"
              onClick={() => setCurrentFileName(e)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Table
      data={data}
      options={options}
      columns={columns}
      onRowClick={onRowClick}
      detailPanel={detailPanel}
      selectedRow={selectedRelationRow}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateRelation: (payload) => dispatch(updateRelation(payload)),
});

export default connect(null, mapDispatchToProps)(OverviewRelationTable);
