import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Table from '../../layouts/Header/Table/Table';
import { updateNer } from '../../reducers/editstate';
import { nercolors } from '../../utils/colors';
import { FcFilledFilter } from 'react-icons/fc';
import Chip from '@material-ui/core/Chip';
import $ from 'jquery';

const OverviewNerTable = (props) => {
  const {
    data,
    originalNetwork,
    setSelectedNode,
    selectedNerRow,
    setSelectedNerRow,
    setNetworkData,
    setCurrentFileName,
  } = props;

  useEffect(() => {
    setSelectedNerRow(null);
    setSelectedNode(null);
  }, [data]);

  const updateNetwork = (ner) => {
    var nerArr = ner.map((e) => e.label + '_' + e.type);
    if (nerArr.length === originalNetwork['nodes'].length) {
      return originalNetwork;
    }
    var newNetwork = $.extend(true, {}, originalNetwork);
    newNetwork['links'] = newNetwork['links']
      .filter(
        (link) =>
          nerArr.includes(link.source.id) || nerArr.includes(link.target.id)
      )
      .map(function (link) {
        return {
          source: link.source.id,
          target: link.target.id,
          relation: link.relation,
        };
      });
    var newNodes = [];
    newNetwork['nodes'].forEach((node) => {
      if (nerArr.includes(node.id)) {
        newNodes.push(node.id);
        newNodes.push(...node.neighbors);
      }
    });
    newNetwork['nodes'] = newNetwork['nodes'].filter((node) =>
      newNodes.includes(node.id)
    );
    return newNetwork;
  };

  const columns = [
    { title: 'Entity', field: 'label', editable: 'never' },
    { title: 'ID', field: 'id', hidden: true },
    { title: 'Documents', field: 'documents', hidden: true },
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
    { title: 'Count', field: 'value', editable: 'never' },
  ];

  const tableRef = React.useRef();

  const onRowClick = (evt, row) => {
    if (selectedNerRow === row.tableData.id) {
      setSelectedNerRow(null);
      setSelectedNode(null);
    } else {
      setSelectedNerRow(row.tableData.id);
      setSelectedNode(row.id + '_' + row.type);
    }
  };

  const options = {
    showTitle: false,
    filtering: true,
    search: true,
    rowStyle: (rowData) => ({
      backgroundColor:
        selectedNerRow === rowData.tableData.id ? '#EEE' : '#FFF',
    }),
    selection: true,
  };

  const actions = [
    {
      tooltip: 'Filter these entities',
      icon: () => <FcFilledFilter />,
      onClick: (evt, data) => {
        var newData = updateNetwork(data);
        setNetworkData(newData);
      },
    },
  ];

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
      actions={actions}
      options={options}
      columns={columns}
      tableRef={tableRef}
      onRowClick={onRowClick}
      detailPanel={detailPanel}
      selectedRow={selectedNerRow}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateNer: (payload) => dispatch(updateNer(payload)),
});

export default connect(null, mapDispatchToProps)(OverviewNerTable);
