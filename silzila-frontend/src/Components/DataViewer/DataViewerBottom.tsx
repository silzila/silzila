// This component houses
// 	- Option to switch dataset, L
// 	- List of tables for selected dataset
// 	- Tablle for sample records

import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import {
// 	setSelectedDsInTile,
// 	setSelectedTableInTile,
// } from "../../redux/ChartProperties/actionsChartProperties";
// import { addTableRecords } from "../../redux/SampleTableRecords/sampleTableRecordsActions";
// import {
// 	actionsToAddTile,
// 	setSelectedDataSetList,
// 	setTablesForSelectedDataSets,
// } from "../../redux/TabTile/actionsTabTile";
import FetchData from "../ServerCall/FetchData";
import { ChangeConnection } from "../CommonFunctions/DialogComponents";
import DatasetListPopover from "../CommonFunctions/PopOverComponents/DatasetListPopover";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import "./dataViewerBottom.css";
import DisplayTable from "./DisplayTable";
import {
  setSelectedDsInTile,
  setSelectedTableInTile,
  resetChartProperties
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import { addTableRecords } from "../../redux/SampleTableRecords/SampleTableRecordsActions";
import {
  DataViewerBottomProps,
  DataViewerBottomStateProps,
} from "./DataViewerBottomInterfaces";
import {
  actionsToAddTile,
  resetAllStates,
  setSelectedDataSetList,
  setTablesForSelectedDataSets,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { IndChartPropProperties } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import Logger from "../../Logger";
import { setSelectedDatasetForDynamicMeasure } from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import RichTreeViewControl from '../Controls/RichTreeViewControl';
import { ConvertListOfListToDataConnectionRichTreeViewList, flattenList } from '../CommonFunctions/CommonFunctions';
import {
  addChartFilterGroupName,
  addChartFilterTabTileName,
  updateChartFilterSelectedGroups
} from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions"
import {
  NotificationDialog,
} from "../CommonFunctions/DialogComponents";
import SavedCalculationsHolder from "../Calculations/SavedCalculationHolder/SavedCalculationsHolder";

import { resetPlayBookData } from '../../redux/PlayBook/PlayBookActions';
import { resetChartControls } from '../../redux/ChartPoperties/ChartControlsActions';
import { resetSampleRecords } from '../../redux/SampleTableRecords/SampleTableRecordsActions';
import Box from "@mui/material/Box";
import { palette } from "../..";

export const getTableData = async (
  dc_uid: string,
  tableObj: any,
  token: string,
  ds_id: string,
  workSpaceId: string,
  allPreviousSavedNonAggregatedCalculations?: any
) => {
  var database: string = tableObj.database;
  var schema: string = tableObj.schema;
  var table: string = tableObj.table;
  var url: string = "";
  if (tableObj.flatFileId) {
    url = `file-data-sample-records?workspaceId=${workSpaceId}&flatfileId=${tableObj.flatFileId}&datasetId=${ds_id}&table=${table}&tableId=${tableObj.id}`;
  } else {
    url = `sample-records?workspaceId=${workSpaceId}&databaseId=${dc_uid}&datasetId=${ds_id}&recordCount=100&database=${database}&schema=${schema}&table=${table}&tableId=${tableObj.id}`;
  }

  let res: any;

  if (
    allPreviousSavedNonAggregatedCalculations?.length > 0
    // we have to write a check here for tables. We can't allow this if statement to run on just all the tables
    // TODO: here we have to verify if the table is same as the one where we should render the sample records + saved calculations.
  ) {
    const payload= allPreviousSavedNonAggregatedCalculations.map((calculation: any) => [calculation])
    res = await FetchData({
      requestType: "withData",
      method:"POST",
      url: url,
      headers: { Authorization: `Bearer ${token}` },

      // TODO: put real data in data here.
      data: payload
    });

  } else {

    res = await FetchData({
      requestType: "noData",
      method: tableObj.flatFileId?"GET":"POST",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
    });

  }



  if (res.status) {
    return res.data;
  } else {
    Logger("info", "Get Table Data Error", res);
  }
};
export const getTableDataWithCustomQuery = async (
  dc_uid: string,
  table: any,
  token: string,
  workSpaceId: string
) => {
  var url: string = `sample-records-customquery/${dc_uid}/200?workspaceId=${workSpaceId}`;

  var res: any = await FetchData({
    requestType: "withData",
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: table.customQuery,
  });

  if (res.status) {
    return res.data;
  } else {
    Logger("info", "Get Table Data Error", res);
  }
};

export const getColumnTypeswithCustomQuery = async (
  dc_uid: string,
  table: any,
  token: string,
  workSpaceId: string
) => {
  var url: string = `metadata-columns-customquery/${dc_uid}?workspaceId=${workSpaceId}`;

  var res: any = await FetchData({
    requestType: "withData",
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: table.customQuery,
  });

  if (res.status) {
    return res.data;
  } else {
    Logger("info", "Get Table Data Error", res);
  }
};
export const getColumnTypes = async (
  dc_uid: string,
  tableObj: any,
  token: string,
  workSpaceId: string,
  allPreviousSavedNonAggregatedCalculations?: any
) => {
  var database: string = tableObj.database;
  var schema: string = tableObj.schema;
  var table: string = tableObj.table;
  var url: string = "";
  if (tableObj.flatFileId) {
    url = `file-data-column-details/${tableObj.flatFileId}?workspaceId=${workSpaceId}&tableId=${tableObj.id}`;
  } else {
    url = `metadata-columns/${dc_uid}?workspaceId=${workSpaceId}&database=${database}&schema=${schema}&table=${table}`;
  }

  let res: any;

  if (allPreviousSavedNonAggregatedCalculations?.length > 0) {
    /**
     * every calculation info has to be inside an array
     * API requirement:::::
     * [
     *  [{calculationInfo1Properties}],
     * [{calculationInfo2Properties}],
     * ]
     */
    const payload=allPreviousSavedNonAggregatedCalculations.map((calculation: any) => [calculation])
    res = await FetchData({
      requestType: "withData",
      method: "POST",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
      data: payload
    });
  } else {
    res = await FetchData({
      requestType: "noData",
      method: "POST",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (res.status) {
    let finalResult: any = [];
    if (tableObj.flatFileId) {
      finalResult = res.data.map((el: any) => {
        return {
          columnName: el.fieldName,
          dataType: el.dataType,
        };
      });
    } else {
      finalResult = res.data;
    }
    return finalResult;
  } else {
    Logger("info", "Get Table ColumnsType Error", res);
  }
};

const DataViewerBottom = ({
  // state
  token,
  tabTileProps,
  chartProps,
  sampleRecords,
  tabState,
  chartFilterGroup,
  pbId,
  calculations,

  // dispatch
  setSelectedDataSetList,
  setSelectedDs,
  setSelectedTable,
  setTablesForDs,
  addRecords,
  addTile,
  resetChartProperties,
  resetPlayBookData,
  resetChartControls,
  resetSampleRecords,
  addChartFilterGroupName,
  updateChartFilterSelectedGroups,
  addChartFilterTabTileName,
}: any) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  var selectedChartProp: IndChartPropProperties =
    chartProps.properties[propKey];

  var tables: any =
    tabTileProps?.tablesForSelectedDataSets?.[
    selectedChartProp?.selectedDs?.id
    ];

  const [openAlert, setOpenAlert] = useState<boolean>(true);
  const [QueryErrorMessage, setQueryErrorMessage] = useState<string>("");

  const [showTreeView, setShowTreeView] = useState<boolean>(false);
  const [dataSetTree, setDataSetTree] = useState<Array<Object>>([]);
  const [selectedDataSet, setSelectedDataSet] = useState<any>({});

  const savedCalculations = useMemo(() => {
    // Filter logic inside useMemo's body
    return calculations?.savedCalculations?.filter(
      (calculation: any) => calculation.datasetId === selectedDataSet?.id
    );
  }, [calculations?.savedCalculations, selectedDataSet?.id]);


  const location = useLocation();
  const state = location.state;
  const getNewGroupName = (numOfGroups: number): string => {
    let isUnique = true;
    let newName = "Filter Group " + numOfGroups;
    Object.keys(chartFilterGroup.groups).forEach((grp) => {
      if (chartFilterGroup.groups[grp].name === newName) {
        isUnique = false;
        return;
      }
    });
    if (!isUnique) {
      return getNewGroupName(numOfGroups + 1);
    } else {
      return newName;
    }
  };

  const handleProceedButtonClick = (id: string) => {
    let tree = JSON.parse(JSON.stringify(dataSetTree));

    let flatList = flattenList(tree);

    let found: any = flatList.find((item: any) => item.id === id)

    //console.log(found)

    if (found) {
      setSelectedDataSet(found);

      setShowTreeView(false);
    }
    else {
      setOpenAlert(true);
      setQueryErrorMessage("Please select a DataSet.");
    }
  }

  useEffect(() => {
    
    const fetchData = async () => {
      if (selectedDataSet.id && !tabTileProps.selectedDataSetList.find((ds: any) => ds.id === selectedDataSet.id)) {
        setLoading(true);
        let dataSetResponse = await getDataSetDetail();
        let dataSet: any = {
          connectionId: dataSetResponse.connectionId,
          datasetName: selectedDataSet.label,
          id: selectedDataSet.id,
          isFlatFileData: false,
          workSpaceId: selectedDataSet.workSpaceId
        };

        setSelectedDataSetList(dataSet);
        setSelectedDatasetForDynamicMeasure(dataSet);

        //var datasetFromServer: any = await getTables(dataSet.id);
        setTablesForDs({ [dataSet.id]: dataSetResponse.dataSchema.tables });
        //setSelectedDs("1.1", dataSet);
        /*  PRS 13Nov2024 */
        setSelectedDs(propKey, dataSet);
        if (!chartProps.properties[propKey].selectedDs.id) {
          addChartFilterTabTileName(dataSet.id, "1.1");
          let numOfGroups = 0;
          if (
            Object.keys(chartFilterGroup.groups) &&
            Object.keys(chartFilterGroup.groups).length > 0
          ) {
            numOfGroups = Object.keys(chartFilterGroup.groups).length;
          }
          let newGroupName = getNewGroupName(numOfGroups + 1);
          let groupId =
            dataSet.id + "_" + newGroupName + new Date().getMilliseconds();

          addChartFilterGroupName(dataSet.id, groupId, newGroupName);
          updateChartFilterSelectedGroups("1.1", groupId);
        }
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataSet]);

  const getDataSetDetail = async () => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/${selectedDataSet.id}?workspaceId=${selectedDataSet.workSpaceId || state?.parentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    let response: any = {};

    if (result.status) {
      response = result.data;
      return response;

    } else {
      Logger("error", result.data.detail);
    }
  }

  const getAllDataSets = async () => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/tree`,
      headers: { Authorization: `Bearer ${token}` },
    });

    let list = [];

    if (result.status) {
      list = result.data;
    } else {
      Logger("error", result.data.detail);
    }

    setDataSetTree(ConvertListOfListToDataConnectionRichTreeViewList(list, 'dataset'));

    if (!pbId && !selectedChartProp.selectedDs?.id) {
      setShowTreeView(true);
    }
  }

  useEffect(() => {
    if (!pbId && !selectedChartProp.selectedDs?.id) {
      resetChartProperties();
      resetPlayBookData();
      resetChartControls();
      resetSampleRecords();
    }

    getAllDataSets();
  }, [pbId])

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDataset, setSelectedDataset] = useState<string | any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [openChangeDatasetDlg, setOpenChangeDatasetDlg] =
    useState<boolean>(false);
  const [addNewOrChooseExistingDS, setAddNewOrChooseExistingDS] =
    useState<string>("");

  // When a new dataset is added to the tile for work,
  // set it in SelectedDataSet of tabTileProps
  // useEffect(async () => {
  useEffect(() => {
    if (selectedDataset !== "") {
      var isAlready = tabTileProps.selectedDataSetList.filter(
        (ds: string | any) => ds === selectedDataset
      );
      if (isAlready.length > 0) {
        window.alert("Dataset already in selected list");
      } else {

        const fetchData = async () => {
          setSelectedDataSetList(selectedDataset);
          setSelectedDatasetForDynamicMeasure(selectedDataset);

          var datasetFromServer: any = await getTables(selectedDataset.id);
          setTablesForDs({ [selectedDataset.id]: datasetFromServer.dataSchema.tables });
          setSelectedDs(propKey, selectedDataset);
          setOpen(false);
        };

        fetchData();
      }
    }
  }, [selectedDataset]);

  // When a Dataset is selected, make sure the tables for that dataset is present in store.
  // If not, get it from server and save in store
  // useEffect(async() => {
  useEffect(() => {
    const fetchData = async () => {
      if (
        tabTileProps?.tablesForSelectedDataSets?.[
        selectedChartProp?.selectedDs?.id
        ] === undefined
      ) {
        setLoading(true);
        // var tablesFromServer = await getTables(selectedChartProp.selectedDs?.ds_uid);
        var tablesFromServer: any = await getTables(
          selectedChartProp.selectedDs?.id
        );
        setTablesForDs({
          [selectedDataset.id]: tablesFromServer?.dataSchema?.tables,
        });
        setLoading(false);
      }
    };

    if (selectedChartProp.selectedDs?.id) {
      fetchData();
    }
  }, [selectedChartProp.selectedDs]);

  const getTables = async (uid: any) => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/${uid}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status) {
      return result.data;
    } else { 
    }
  };

  useEffect(() => {
      if(!state){
        navigate("/")
      }
    }, [state, navigate])
    if (!state) {
      return null;
    }

  // const handleDataSetChange = (value) => {
  // 	if (value === "addNewDataset") {
  // 		setOpen(true);
  // 	} else {
  // 		var dsObj = tabTileProps.selectedDataSetList.filter((ds) => ds.ds_uid === value)[0];
  // 		setSelectedDs(propKey, dsObj);
  // 	}
  // };

  /*When a table selected in dataset is changed,
  check if this table's sample records are already present
  if yes,display them. If no, get the table records and save in store*/

  const handleTableChange= async (table: any, dsUid?: any, savedNonAggregatedCalculations?: any) => {

    if (!savedNonAggregatedCalculations) {
      console.log("Something went wrong")
      return
    }

    if (table.flatFileId) {
    }
    if (table.id !== selectedChartProp.selectedTable) {
      setSelectedTable(propKey, {
        [selectedChartProp.selectedDs.id]: table.id,
      });

      if (sampleRecords?.[selectedChartProp.selectedDs?.id]?.[table.id]) {
      } else {
        setLoading(true);
        var dc_uid = selectedChartProp.selectedDs?.connectionId;
        var id = selectedChartProp.selectedDs?.id;
        var tableRecords;
        var recordsType;
        if (table.isCustomQuery) {
          tableRecords = await getTableDataWithCustomQuery(
            dc_uid,
            table,
            token,
            selectedChartProp.selectedDs.workSpaceId || state?.parentId
          );
          recordsType = await getColumnTypeswithCustomQuery(
            dc_uid,
            table,
            token,
            selectedChartProp.selectedDs.workSpaceId
          );
        } else {
         
          tableRecords = await getTableData(dc_uid, table, token, id, selectedChartProp.selectedDs.workSpaceId || state?.parentId, savedNonAggregatedCalculations);

          recordsType = await getColumnTypes(dc_uid, table, token, selectedChartProp.selectedDs.workSpaceId || state?.parentId, savedNonAggregatedCalculations);
        }

        addRecords(id, table.id, tableRecords, recordsType);
        setLoading(false);
      }
    }
  };

  // List of tables for a dataset, displayed
  const TableListForDs: any = () => {
    if (tables !== undefined) {
      return tables.map((table: any) => {
        return (
          <div
          style={{fontSize: "0.75rem",color:palette.primary.contrastText}}
            className={
              table.id ===
                selectedChartProp.selectedTable?.[
                selectedChartProp.selectedDs?.id
                ]
                ? "dsIndiTableInTileSelected"
                : "dsIndiTableInTile"
            }
            key={table.id}
            onClick={() => {
              handleTableChange(table, undefined, savedCalculations?.length > 0 ? savedCalculations?.filter((calculation: any) => (!calculation?.isAggregated && calculation?.tableId === table.id))?.map((calculation: any) => calculation?.calculationInfo) : [])
            }}
          >
            {table.alias}
          </div>
        );
      });
    } else return null;
  };

  var selectInput = { fontSize: "0.75rem", padding: "2px 1rem" };

  /* when the dataset itself is changed,
  if there are no added fields in dropzone, allow the change.
  else, open a new tile with the selected dataset*/
  const handleDataSetChange = (value: any) => {
    const axes = chartProps.properties[propKey].chartAxes;
    setAddNewOrChooseExistingDS(value);
    if (value === "addNewDataset") {
      var count = 0;
      axes.forEach((ax: any) => {
        if (ax.fields.length > 0) {
          count = count + 1;
        }
      });

      if (count > 0) {
        setOpenChangeDatasetDlg(true);
      } else {
        //setOpen(true); ////TODO:
        setShowTreeView(true);
      }
    } else {
      var count = 0;
      axes.forEach((ax: any) => {
        if (ax.fields.length > 0) {
          count = count + 1;
        }
      });

      if (count > 0) {
        setOpenChangeDatasetDlg(true);
      } else {
        var dsObj = tabTileProps.selectedDataSetList.filter(
          (ds: any) => ds.id === value
        )[0];
        setSelectedDs(propKey, dsObj);
      }
    }
  };

  const onChangeOrAddDataset = () => {
    let tabObj = tabState.tabs[tabTileProps.selectedTabId];

    addTile(
      tabObj.tabId,
      tabObj.nextTileId,
      tabTileProps.selectedTable,
      chartProps.properties[propKey].selectedDs,
      chartProps.properties[propKey].selectedTable
    );

    setOpenChangeDatasetDlg(false);
    if (addNewOrChooseExistingDS === "addNewDataset") {
      /*  PRS 13Nov2024 */
      setShowTreeView(true);
      //setOpen(true);
    } else {
      var dsObj = tabTileProps.selectedDataSetList.filter(
        (ds: any) => ds.id === addNewOrChooseExistingDS
      )[0];
      setSelectedDs(`${tabObj.tabId}.${tabObj.nextTileId}`, dsObj);
    }
  };
  return (
    <React.Fragment>
      {QueryErrorMessage.length > 0 ? (
        <NotificationDialog
          onCloseAlert={() => {
            setOpenAlert(false);
            setQueryErrorMessage("");
          }}
          severity={"error"}
          testMessage={QueryErrorMessage}
          openAlert={openAlert}
        />
      ) : null}
      {showTreeView ? (
        <RichTreeViewControl
          currentWorkspace={state?.parentId}
          list={dataSetTree}
          title={"Select a DataSet"}
          showInPopup={showTreeView}
          showControls={true}
          handleCloseButtonClick={(e: any) => {
            if (selectedDataSet?.id) {
              setShowTreeView(false);
            } else {
              setShowTreeView(false);
              navigate("/");
              resetAllStates();
            }
          }}
          handleProceedButtonClick={handleProceedButtonClick}
        ></RichTreeViewControl>
      ) : null}

      {chartProps.properties[propKey].chartType === "richText" ? null : (
        <div className="dataViewerBottom">
          <div className="dataSetAndTableList" style={{padding:'0.5rem 1rem 0.5rem 0.9rem',minWidth:'15.625rem'}}>
            <div className="dataSetSelect" style={{width: "100%",padding:'0'}}>
              <FormControl
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "0px",
                  },
                }}
                fullWidth
                size="small"
                style={{
                  background: "white",
                  fontSize: "12px",
                  borderRadius: "4px",
                }}
              >
                <InputLabel
                  id="selectDataSet"
                  sx={{
                    fontSize: "12px",
                    lineHeight: "1.5rem",
                    "&.Mui-focused": {
                      color: "#2bb9bb",
                    },
                  }}
                  shrink={true}
                >
                  DataSet
                </InputLabel>

                <Select
                  title={selectedChartProp.selectedDs.datasetName}
                  label="DataSet"
                  labelId="selectDataSet"
                  value={selectedChartProp.selectedDs?.id ?? selectedDataSet.id}
                  variant="outlined"
                  key={selectedDataSet.id || selectedChartProp.selectedDs?.id}
                  onChange={(e) => {
                    handleDataSetChange(e.target.value);
                  }}
                  sx={{
                    height: "1.5rem",
                    fontSize: "0.75rem",
                    color: "primary.contrastText",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      color: "primary.main",
                    },
                    "&.Mui-focused .MuiSvgIcon-root ": {
                      fill: "#2bb9bb !important",
                    },
                  }}
                  notched={true}
                >
                  <MenuItem
                    sx={{
                      fontSize: "0.75rem",
                      padding: "2px 1rem",
                      borderBottom: "1px solid lightgray",
                    }}
                    value="addNewDataset"
                  >
                    Add Dataset
                  </MenuItem>

                  {tabTileProps.selectedDataSetList.map((ds: any) => {
                    return (
                      <MenuItem sx={selectInput} value={ds.id} key={ds.id}>
                        {ds.datasetName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

            <div className="tileTableList">
              <div className="tablescontainerinDataviewerBottom" style={{padding:0  }}>
                <TableListForDs />
              </div>
            </div>
            <DatasetListPopover
              showCard={open}
              setShowCard={setOpen}
              popOverTitle="Select Dataset"
              setSelectedDataset={setSelectedDataset}
            />
          </div>
          {selectedChartProp.selectedTable?.[
            selectedChartProp.selectedDs.id
          ] ? (
            <Box
              className="tileTableView"
              sx={{ "&::-webkit-scrollbar": { width: "4px", height: "4px" } }}
            >
              <DisplayTable
                dsId={selectedChartProp.selectedDs?.id}
                table={
                  selectedChartProp.selectedTable[
                    selectedChartProp.selectedDs?.id
                  ]
                }
              />
            </Box>
          ) : (
            <div
              className="axisInfo"
              style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color:palette.primary.contrastText
              }}
            >
              Select any table from the list on left to show records here
            </div>
          )}
          {loading ? <LoadingPopover /> : null}
          <ChangeConnection
            onChangeOrAddDataset={onChangeOrAddDataset}
            open={openChangeDatasetDlg}
            setOpen={setOpenChangeDatasetDlg}
            heading="CHANGE DATASET"
            message="Want to open in new tile?"
          />
          {/* <div> */}
          <SavedCalculationsHolder propKey={propKey} />
          {/* </div> */}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: DataViewerBottomStateProps) => {
  return {
    token: state.isLogged.accessToken,
    tabTileProps: state.tabTileProps,
    chartProps: state.chartProperties,
    sampleRecords: state.sampleRecords,
    tabState: state.tabState,
    chartFilterGroup: state.chartFilterGroup,
    calculations: state.calculations,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setSelectedDataSetList: (dataset: string) =>
      dispatch(setSelectedDataSetList(dataset)),
    setTablesForDs: (tablesObj: any) =>
      dispatch(setTablesForSelectedDataSets(tablesObj)),
    setSelectedDs: (propKey: string, selectedDs: any) =>
      dispatch(setSelectedDsInTile(propKey, selectedDs)),
    setSelectedTable: (propKey: string, selectedTable: any) =>
      dispatch(setSelectedTableInTile(propKey, selectedTable)),
    addRecords: (
      id: string,
      tableId: string,
      tableRecords: any,
      columnType: any
    ) => dispatch(addTableRecords(id, tableId, tableRecords, columnType)),
    addTile: (
      tabId: number,
      nextTileId: number,
      table: any,
      selectedDataset: any,
      selectedTables: any
    ) =>
      dispatch(
        actionsToAddTile({
          tabId,
          nextTileId,
          table,
          fromTab: false,
          selectedDs: selectedDataset,
          selectedTablesInDs: selectedTables,
        })
      ),
    setSelectedDatasetForDynamicMeasure: (dataset: any) =>
      dispatch(setSelectedDatasetForDynamicMeasure(dataset)),
    resetChartProperties: () => dispatch(resetChartProperties()),
    resetPlayBookData: () => dispatch(resetPlayBookData()),
    resetChartControls: () => dispatch(resetChartControls()), //resetSampleRecords
    resetSampleRecords: () => dispatch(resetSampleRecords()),

    updateChartFilterSelectedGroups: (groupId: string, filters: any) =>
      dispatch(updateChartFilterSelectedGroups(groupId, filters)),
    addChartFilterGroupName: (
      selectedDatasetID: string,
      groupId: string,
      groupName: string
    ) =>
      dispatch(addChartFilterGroupName(selectedDatasetID, groupId, groupName)),
    addChartFilterTabTileName: (
      selectedDatasetID: string,
      tabTileName: string
    ) => dispatch(addChartFilterTabTileName(selectedDatasetID, tabTileName)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerBottom);
