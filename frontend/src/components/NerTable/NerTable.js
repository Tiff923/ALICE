import React, { useState } from 'react';
import { connect } from 'react-redux';
import Table from '../Table/Table';
import {
  updateNer,
  udpateNerSearch,
  updateSelectedNode,
} from '../../reducers/editstate';
import { nercolors } from '../../utils/colors';

const NerTable = (props) => {
  const [data, setData] = useState(props.data.ents);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    { title: 'Entity', field: 'text', editable: 'never' },
    {
      title: 'Entity Type',
      field: 'type',
      lookup: {
        PERSON: 'PERSON',
        NORP: 'NORP',
        FAC: 'FAC',
        ORG: 'ORG',
        GPE: 'GPE',
        LOC: 'LOC',
        PRODUCT: 'PRODUCT',
        EVENT: 'EVENT',
        WORK_OF_ART: 'WORK_OF_ART',
        LAW: 'LAW',
        LANGUAGE: 'LANGUAGE',
        DATE: 'DATE',
        TIME: 'TIME',
        PERCENT: 'PERCENT',
        MONEY: 'MONEY',
        QUANTITY: 'QUANTITY',
        ORDINAL: 'ORDINAL',
        CARDINAL: 'CARDINAL',
      },
      cellStyle: (rowData) => ({
        background: `${nercolors[rowData]}90`,
        borderColor: `${nercolors[rowData]}`,
      }),
    },
  ];

  const editable = {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        props.updateNer({
          newNer: dataUpdate,
          nerToRelation: [
            dataUpdate[index].text,
            dataUpdate[index].id,
            dataUpdate[index].type,
            'UPDATE',
          ],
        });
        resolve();
      }),
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          const dataDelete = [...data];
          const index = oldData.tableData.id;
          props.updateNer({
            newNer: dataDelete,
            nerToRelation: [
              dataDelete[index].text,
              dataDelete[index].id,
              dataDelete[index].type,
              'DELETE',
            ],
          });
          dataDelete.splice(index, 1);
          setData([...dataDelete]);
          resolve();
        }, 1000);
      }),
  };

  const tableRef = React.useRef();
  const onSearchChange = (s) => {
    var set = new Set();
    tableRef.current.dataManager.searchedData.forEach((e) => {
      set.add(e.text);
    });
    if (s === '') {
      props.udpateNerSearch(new Set());
    } else {
      props.udpateNerSearch(set);
    }
  };

  const onRowClick = (evt, row) => {
    if (selectedRow === row.tableData.id) {
      setSelectedRow(null);
      props.updateSelectedNode('');
    } else {
      setSelectedRow(row.tableData.id);
      props.updateSelectedNode(row.text);
    }
  };
  console.log(tableRef.current);
  return (
    <Table
      data={data}
      columns={columns}
      editable={editable}
      tableRef={tableRef}
      onSearchChange={onSearchChange}
      onRowClick={onRowClick}
      selectedRow={selectedRow}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateNer: (payload) => dispatch(updateNer(payload)),
  udpateNerSearch: (payload) => dispatch(udpateNerSearch(payload)),
  updateSelectedNode: (payload) => dispatch(updateSelectedNode(payload)),
});

export default connect(null, mapDispatchToProps)(NerTable);
