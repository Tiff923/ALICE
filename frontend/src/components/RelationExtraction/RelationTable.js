import React, { useState } from 'react';
import { connect } from 'react-redux';
import Table from '../Table/Table';
import { updateRelation, updateSelectedLink } from '../../reducers/editstate';

const RelationTable = (props) => {
  const { data } = props;
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    { title: 'Entity 1', field: 'e1', editable: 'never' },
    { title: 'Entity 1 Type', field: 'e1_label', editable: 'never' },
    { title: 'Entity 2', field: 'e2', editable: 'never' },
    { title: 'Entity 2 Type', field: 'e2_label', editable: 'never' },
    {
      title: 'Relation Type',
      field: 'relation',
      lookup: {
        'Cause-Effect(e1,e2)': 'Cause-Effect(e1,e2)',
        'Cause-Effect(e2,e1)': 'Cause-Effect(e2,e1)',
        'Component-Whole(e1,e2)': 'Component-Whole(e1,e2)',
        'Component-Whole(e2,e1)': 'Component-Whole(e2,e1)',
        'Content-Container(e1,e2)': 'Content-Container(e1,e2)',
        'Content-Container(e2,e1)': 'Content-Container(e2,e1)',
        'Entity-Destination(e1,e2)': 'Entity-Destination(e1,e2)',
        'Entity-Destination(e2,e1)': 'Entity-Destination(e2,e1)',
        'Entity-Origin(e1,e2)': 'Entity-Origin(e1,e2)',
        'Entity-Origin(e2,e1)': 'Entity-Origin(e2,e1)',
        'Instrument-Agency(e1,e2)': 'Instrument-Agency(e1,e2)',
        'Instrument-Agency(e2,e1)': 'Instrument-Agency(e2,e1)',
        'Member-Collection(e1,e2)': 'Member-Collection(e1,e2)',
        'Member-Collection(e2,e1)': 'Member-Collection(e2,e1)',
        'Message-Topic(e1,e2)': 'Message-Topic(e1,e2)',
        'Message-Topic(e2,e1)': 'Message-Topic(e2,e1)',
        'Product-Producer(e1,e2)': 'Product-Producer(e1,e2)',
        'Product-Producer(e2,e1)': 'Product-Producer(e2,e1)',
        Other: 'Other',
      },
      //   cellStyle: (rowData) => ({
      //     background: `${nercolors[rowData]}80`,
      //     borderColor: `${nercolors[rowData]}`,
      //   }),
    },
  ];

  const editable = {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        // setData([...dataUpdate]);
        props.updateRelation(dataUpdate);
        resolve();
      }),
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const dataDelete = [...data];
          const index = oldData.tableData.id;
          dataDelete.splice(index, 1);
          // setData([...dataDelete]);
          props.updateRelation(dataDelete);
          resolve();
        }, 1000);
      }),
  };

  const onRowClick = (evt, row) => {
    if (selectedRow === row.tableData.id) {
      setSelectedRow(null);
      props.updateSelectedLink({});
    } else {
      setSelectedRow(row.tableData.id);
      if (row.relation.slice(-7) === '(e2,e1)') {
        props.updateSelectedLink({
          source: row.e2,
          target: row.e1,
        });
      } else {
        props.updateSelectedLink({
          source: row.e1,
          target: row.e2,
        });
      }
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      editable={editable}
      onRowClick={onRowClick}
      selectedRow={selectedRow}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateRelation: (payload) => dispatch(updateRelation(payload)),
  updateSelectedLink: (payload) => dispatch(updateSelectedLink(payload)),
});

export default connect(null, mapDispatchToProps)(RelationTable);
