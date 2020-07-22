import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Table from '../../layouts/Header/Table/Table';
import { updateRelation } from '../../reducers/editstate';
import { FcFilledFilter } from 'react-icons/fc';
import $ from 'jquery';
import { nercolors } from '../../utils/colors';

const updateNetwork = (data) => {
  const links = [];
  const links_template = {
    source: '',
    target: '',
  };
  // Edges
  const nodes_temp = {};
  for (var i = 0; i < data.length; i++) {
    var temp = $.extend(true, {}, links_template);
    var el = data[i];
    temp['source'] = el['e1'];
    temp['target'] = el['e2'];
    temp['relation'] = el['relation'];
    var node_t = temp['target'];
    var node_t_label = node_t === el['e1'] ? el['e1_label'] : el['e2_label'];
    var node_s = temp['source'];
    var node_s_label = node_s === el['e2'] ? el['e2_label'] : el['e1_label'];
    if (node_t in nodes_temp) {
      nodes_temp[node_t]['val'] += 4;
      nodes_temp[node_t]['neighbors'].add(node_s);
    } else {
      nodes_temp[node_t] = {
        id: node_t,
        name: node_t,
        val: 4,
        color: nercolors[node_t_label],
        neighbors: new Set([node_s]),
      };
    }
    if (node_s in nodes_temp) {
      nodes_temp[node_s]['val'] += 2;
      nodes_temp[node_s]['neighbors'].add(node_t);
    } else {
      nodes_temp[node_s] = {
        id: node_s,
        name: node_s,
        val: 2,
        color: nercolors[node_s_label],
        neighbors: new Set([node_t]),
      };
    }
    links.push(temp);
  }

  const nodes = $.map(nodes_temp, function (value, key) {
    value['neighbors'] = Array.from(value['neighbors']);
    return value;
  });

  return { nodes: nodes, links: links };
};

const RelationTable = (props) => {
  const {
    data,
    selectData,
    currentFileName,
    setSelectedLink,
    selectedRelationRow,
    setSelectedRelationRow,
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
    { title: 'Sentence', field: 'text', hidden: true },
  ];

  const editable = {
    // onRowUpdate: (newData, oldData) =>
    //   new Promise((resolve, reject) => {
    //     setSelectedRelationRow(null);
    //     setSelectedLink(null);
    //     const dataUpdate = [...data];
    //     const index = oldData.tableData.id;
    //     dataUpdate[index] = newData;
    //     props.updateRelation({
    //       newRelation: dataUpdate,
    //       currentFileName: currentFileName,
    //     });
    //     resolve();
    //   }),
    onRowDelete: (oldData) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          setSelectedRelationRow(null);
          setSelectedLink(null);
          const dataDelete = [...data];
          const index = oldData.tableData.id;
          dataDelete.splice(index, 1);
          props.updateRelation({
            newRelation: dataDelete,
            currentFileName: currentFileName,
          });
          resolve();
        }, 1000);
      }),
  };

  const onRowClick = (evt, row) => {
    if (selectedRelationRow === row.tableData.id) {
      setSelectedRelationRow(null);
      setSelectedLink(null);
    } else {
      setSelectedRelationRow(row.tableData.id);
      if (row.relation.slice(-7) === '(e2,e1)') {
        setSelectedLink({
          source: row.e2,
          target: row.e1,
        });
      } else {
        setSelectedLink({
          source: row.e1,
          target: row.e2,
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
    selection: true,
  };

  const actions = [
    {
      tooltip: 'Filter these relations',
      icon: () => <FcFilledFilter />,
      onClick: (evt, data) => {
        var newData = updateNetwork(data);
        selectData(newData);
      },
    },
  ];

  const detailPanel = (rowData) => {
    return (
      <div style={{ padding: 5 }}>
        <span>Sentence: </span>
        <span>{rowData.text}</span>
      </div>
    );
  };

  return (
    <Table
      data={data}
      actions={actions}
      options={options}
      columns={columns}
      editable={editable}
      onRowClick={onRowClick}
      selectedRow={selectedRelationRow}
      detailPanel={detailPanel}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateRelation: (payload) => dispatch(updateRelation(payload)),
});

export default connect(null, mapDispatchToProps)(RelationTable);
