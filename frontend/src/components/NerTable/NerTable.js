import React, { useState } from 'react';
import { connect } from 'react-redux';
import Table from '../Table/Table';
import { updateNer, udpateNerSearch } from '../../reducers/editstate';
import { nercolors } from '../../utils/colors';

const NerTable = (props) => {
  const data = props.data.ents;
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
        const dataUpdate = data;
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
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
          dataDelete.splice(index, 1);
          props.updateNer({
            newNer: dataDelete,
            nerToRelation: [
              data[index].text,
              data[index].id,
              data[index].type,
              'DELETE',
            ],
          });
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
      props.setSelectedNode('');
    } else {
      setSelectedRow(row.tableData.id);
      props.setSelectedNode(row.text);
    }
  };

  const onFilterChange = () => {
    var set = new Set();
    tableRef.current.dataManager.filteredData.forEach((e) => {
      set.add(e.text);
    });
    if (tableRef.current.dataManager.filteredData.length === data.length) {
      props.udpateNerSearch(new Set());
    } else {
      props.udpateNerSearch(set);
    }
  };

  const options = {
    showTitle: false,
    filtering: true,
    search: true,
    rowStyle: (rowData) => ({
      backgroundColor: selectedRow === rowData.tableData.id ? '#EEE' : '#FFF',
    }),
  };

  return (
    <Table
      data={data}
      options={options}
      columns={columns}
      editable={editable}
      tableRef={tableRef}
      onSearchChange={onSearchChange}
      onRowClick={onRowClick}
      selectedRow={selectedRow}
      onFilterChange={onFilterChange}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateNer: (payload) => dispatch(updateNer(payload)),
  udpateNerSearch: (payload) => dispatch(udpateNerSearch(payload)),
});

export default connect(null, mapDispatchToProps)(NerTable);
