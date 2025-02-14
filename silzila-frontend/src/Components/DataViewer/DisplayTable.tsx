// This component houses Sample records for selected table from dataset
// This sample records can be view as
// 	- Full table with all fields and values
// 	- Just column names of table

// Table columns are draggable. These dragged table columns are then dropped into dropzones

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { SampleRecordsState } from "../../redux/SampleTableRecords/SampleTableRecordsInterfaces";
import {
  TabTileStateProps,
  TabTileStateProps2,
} from "../../redux/TabTile/TabTilePropsInterfaces";
import { Box } from "./Box";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import {
  deleteSavedCalculation,
  editSavedCalculation,
} from "../../redux/Calculations/CalculationsActions";
import { addTableRecords } from "../../redux/SampleTableRecords/SampleTableRecordsActions";
import FetchData from "../ServerCall/FetchData";
import { serverEndPoint } from "../ServerCall/EnvironmentVariables";
import { deleteItemInChartProp } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { palette } from "../..";

interface DisplayTableProps {
  dsId: string;
  table: any;
  tableRecords: any;
  tabTileProps: TabTileStateProps;
  calculations: any;
  editCalculationFunc: any;
  deleteCalculationFunc: any;
  addRecords: any;
  chartProperties: any;
  deleteItemFromChartFunc: any;
}

const DisplayTable = ({
  // props
  dsId,
  table,
  chartProperties,

  // state
  tableRecords,
  tabTileProps,
  calculations,
  editCalculationFunc,
  deleteCalculationFunc,
  deleteItemFromChartFunc,
  addRecords,
}: DisplayTableProps) => {
  const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  const selectedDataset = chartProperties?.properties[propKey]?.selectedDs;
  const tablesForSelectedDataset = tabTileProps.tablesForSelectedDataSets;
  const selectedTable =
    chartProperties?.properties[propKey]?.selectedTable[selectedDataset?.id];
  const selectedTableInTablesForSelectedDataSets = tabTileProps?.tablesForSelectedDataSets[selectedDataset?.id]?.findIndex((table: any) => table.id === selectedTable)
  const flatFileId = tabTileProps?.tablesForSelectedDataSets[selectedDataset?.id][selectedTableInTablesForSelectedDataSets]?.flatFileId

  var SampleRecords: any = tableRecords?.[dsId]?.[table];

  const [columnsData, setColumnsData] = useState<any[]>([]);

  const savedCalculations = calculations?.savedCalculations;

  const savedNonAggregatedCalculations =
    calculations?.savedCalculations?.filter(
      (calculation: any) => !calculation.isAggregated
    );

  const tableRef = useRef<any | HTMLDivElement>(null);

  useEffect(() => {
    const lastChild = tableRef.current?.lastElementChild;
    if (lastChild) {
      lastChild.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [savedNonAggregatedCalculations?.length]);

  const formatFieldsData = () => {
    let _fieldsData: any[] = [];
    if (SampleRecords && SampleRecords.length > 0) {
      var tableKeys = Object.keys(SampleRecords[0]);
      var dataType = tableRecords.recordsColumnType[dsId][table];


      for (let i = 0; i < tableKeys.length; i++) {


        _fieldsData.push({
          fieldname: tableKeys[i],
          displayname: tableKeys[i],
          dataType: dataType?.filter(
            (sc: any) => sc.columnName === tableKeys[i])[0].dataType,
          tableId: table,
        });
      }
      return _fieldsData;
    }
    return _fieldsData;
  };

  const prepareInputs = () => {
    let _fields = formatFieldsData();

    _fields = _fields.sort((a, b) => {
      const isASaved = savedCalculations?.find((calc: any) => {
        return (
          calc.calculationInfo.calculatedFieldName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") ===
          a.fieldname.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
      });

      const isBSaved = savedCalculations?.find((calc: any) => {
        return (
          calc.calculationInfo.calculatedFieldName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") ===
          b.fieldname.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
      });

      if (isASaved && !isBSaved) return 1;

      if (!isASaved && isBSaved) return -1;

      return 0;
    });

    setColumnsData(_fields);
  };

  useEffect(() => {
    prepareInputs();
  }, [SampleRecords]);

  // Get the column names from first row of table data
  const getKeys = (record: any) => {
    return Object.keys(record);
  };

  // Get the column names from getKeys() and render the header for table

  const GetHeaders: any = () => {
    if (SampleRecords && SampleRecords.length > 0) {
      let keys = getKeys(SampleRecords[0]);
      keys = keys.sort((a, b) => {
        const isASaved = savedCalculations?.find(
          (calc: any) =>
            calc.calculationInfo.calculatedFieldName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "") ===
            a.toLowerCase().replace(/[^a-z0-9]/g, "")
        )
          ? true
          : false;
        const isBSaved = savedCalculations?.find(
          (calc: any) =>
            calc.calculationInfo.calculatedFieldName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "") ===
            b.toLowerCase().replace(/[^a-z0-9]/g, "")
        )
          ? true
          : false;

        if (isASaved && !isBSaved) return 1;
        if (!isASaved && isBSaved) return -1;
        return 0;
      });

      return keys.map((key: any, index: number) => {
        const item = columnsData[index];

        const isSavedCalculation = savedCalculations?.find((calc: any) => {
          // TODO: this has to be optimised, this is making everything super duper slow
          if (item && item.fieldname) {
            return (
              calc.calculationInfo.calculatedFieldName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "") ===
              item.fieldname.toLowerCase().replace(/[^a-z0-9]/g, "")
            );
          }
          return false;
        });

        let isCalculationPresentInChartAxes = false;

        const informationForPropDeletion: {
          [key: string]: {
            binIndex: number;
            fieldIndex: number;
          }[];
        } = {};

        const allPropKeys = Object.keys(chartProperties?.properties);

        for (const eachPropKey of allPropKeys) {
          chartProperties?.properties[eachPropKey]?.chartAxes?.forEach(
            (ax: any, axId: number) => {
              ax?.fields?.forEach((field: any, fieldId: number) => {
                // TODO: assumption is saved calculations have unique fieldname, so we can use that to check if the field is saved calculation or not
                if (field.SavedCalculationUUID && key === field.fieldname) {
                  if (!informationForPropDeletion[eachPropKey]) {
                    informationForPropDeletion[eachPropKey] = [];
                  }

                  informationForPropDeletion[eachPropKey].push({
                    binIndex: axId,
                    fieldIndex: fieldId,
                  });
                  isCalculationPresentInChartAxes = true;
                }
              });
            }
          );
        }

        return (
          <TableCell key={`${index}_${key}`}>
            <Box
              allSavedCalculations={savedCalculations}
              name={key}
              type={isSavedCalculation ? "calculation" : "card"}
              fieldData={columnsData[index]}
              colsOnly={false}
              isSavedCalculation={isSavedCalculation}
              handleEditButton={() => {
                editCalculationFunc(propKey, columnsData[index].fieldname);
              }}
              informationForPropDeletion={informationForPropDeletion}
              isPresentInAxes={isCalculationPresentInChartAxes}
              deleteIfPresentInAxes={deleteItemFromChartFunc}
              handleDeleteButton={async () => {
                // @ts-ignore
                const workspaceId = selectedDataset.workSpaceId;
                // @ts-ignore
                const databaseId = selectedDataset.connectionId;
                // @ts-ignore
                const datasetId = selectedDataset.id;

                const tableIdIndex = tablesForSelectedDataset[
                  datasetId
                ].findIndex((item) => item.id === selectedTable);

                // @ts-ignore
                const database = tablesForSelectedDataset[datasetId][tableIdIndex].database;

                // @ts-ignore
                const schema = tablesForSelectedDataset[datasetId][tableIdIndex].schema;

                // @ts-ignore
                const tableId =
                  tablesForSelectedDataset[datasetId][tableIdIndex].id;

                // @ts-ignore
                const tableName = tablesForSelectedDataset[datasetId][tableIdIndex].table;

                if (!columnsData[index].isAggregated) {
                  let allPreviousSavedNonAggregatedCalculations = [
                    ...calculations?.savedCalculations
                      ?.filter(
                        (calculation: any) =>
                          !calculation.isAggregated &&
                          calculation.datasetId === datasetId &&
                          calculation.tableId === tableId
                      )
                      .map((calculation: any) => calculation.calculationInfo),
                  ];

                  const indexOfToBeDeletedCalculation =
                    allPreviousSavedNonAggregatedCalculations.findIndex(
                      (calc: any) => {
                        return (
                          calc.calculatedFieldName
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "") ===
                          columnsData[index].fieldname
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "")
                        );
                      }
                    );

                  allPreviousSavedNonAggregatedCalculations.splice(
                    indexOfToBeDeletedCalculation,
                    1
                  );

                  allPreviousSavedNonAggregatedCalculations =
                    allPreviousSavedNonAggregatedCalculations.map(
                      (cal: any) => [cal]
                    );

                  if (allPreviousSavedNonAggregatedCalculations.length > 0) {
                    const records = await FetchData({
                      url: flatFileId ? `file-data-sample-records?flatfileId=${flatFileId}&datasetId=${datasetId}&tableId=${tableId}` :
                        `sample-records?workspaceId=${workspaceId}&databaseId=${databaseId}&datasetId=${datasetId}&recordCount=100&database=${database}&schema=${schema}&table=${tableName}&tableId=${tableId}`,
                      method: "POST",
                      requestType: "withData",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      data: allPreviousSavedNonAggregatedCalculations,
                    });

                    const headers = await FetchData({
                      url: flatFileId ? `file-data-sample-records?flatfileId=${flatFileId}&datasetId=${datasetId}&tableId=${tableId}` :
                        `metadata-columns/${databaseId}?workspaceId=${workspaceId}&database=${database}&schema=${schema}&table=${tableName}`,
                      method: "post",
                      requestType: "withData",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      data: allPreviousSavedNonAggregatedCalculations,
                    });

                    if (records.status === true && headers.status === true) {
                      const recordsData = await records.data;
                      const headersData = await headers.data;

                      addRecords(datasetId, tableId, recordsData, headersData);
                    }
                  } else {
                    const records = await FetchData({
                      url: flatFileId ? `file-data-sample-records?flatfileId=${flatFileId}&datasetId=${datasetId}&tableId=${tableId}`
                        : `sample-records?workspaceId=${workspaceId}&databaseId=${databaseId}&datasetId=${datasetId}&recordCount=100&database=${database}&schema=${schema}&table=${tableName}&tableId=${tableId}`,
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      requestType: "noData",
                      method: "post",
                    });

                    const headers = await FetchData({
                      url: flatFileId ? `file-data-sample-records?flatfileId=${flatFileId}&datasetId=${datasetId}&tableId=${tableId}` :
                        `metadata-columns/${databaseId}?workspaceId=${workspaceId}&database=${database}&schema=${schema}&table=${tableName}`,
                      method: "post",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                      requestType: "noData",
                    });

                    if (headers.status && records.status) {
                      const recordsData = await records.data;
                      const headersData = await headers.data;
                      addRecords(datasetId, tableId, recordsData, headersData);
                    }
                  }
                }
                deleteCalculationFunc(columnsData[index].fieldname, propKey);
              }}
            />
          </TableCell>
        );
      });
    } else return null;
  };

  // Render a single row of the table
  const RenderRow = (props: any) => {
    return props.keys.map((key: any, index: number) => {
      // Convert boolean values to "True" or "False"
      const value =
        typeof props.data[key] === "boolean"
          ? props.data[key]
            ? "True"
            : "False"
          : props.data[key];
      return <TableCell key={`${index}_${key}`}>{value}</TableCell>;
    });
  };

  // Get all rows data and pass it to RenderRow to display table data
  const getRowsData = () => {
    if (SampleRecords && SampleRecords.length > 0) {
      let keys = getKeys(SampleRecords[0]);
      keys = keys.sort((a, b) => {
        // check if a is a saved calculation if so return -1
        const isASaved = savedCalculations?.find(
          (calc: any) =>
            calc.calculationInfo.calculatedFieldName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "") ===
            a.toLowerCase().replace(/[^a-z0-9]/g, "")
        )
          ? true
          : false;
        const isBSaved = savedCalculations?.find(
          (calc: any) =>
            calc.calculationInfo.calculatedFieldName
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "") ===
            b.toLowerCase().replace(/[^a-z0-9]/g, "")
        )
          ? true
          : false;

        if (isASaved && !isBSaved) return 1;
        if (!isASaved && isBSaved) return -1;
        return 0;
      });

      return SampleRecords.map((row: any, index: number) => {
        return (
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "0px",
              },
            }}
            key={index}
          >
            <RenderRow key={index} data={row} keys={keys} />
          </TableRow>
        );
      });
    } else return null;
  };

  const RenderButtons: any = () => {
    if (SampleRecords && SampleRecords.length > 0) {
      var keys = getKeys(SampleRecords[0]);
      return keys.map((key: any, index: number) => {
        return (
          <button
            key={key}
            className="boxContainer"
            draggable="true"
          // onDragStart={(e) => handleDragStart(e, columnsData[index])}
          >
            <Box
              name={key}
              type="card"
              fieldData={columnsData[index]}
              colsOnly={true}
            />
          </button>
        );
      });
    } else return null;
  };

  return tabTileProps.columnsOnlyDisplay ? (
    <div className="showColumnsOnly">
      <RenderButtons />
    </div>
  ) : (
    <TableContainer
      ref={tableRef}
      sx={{
        height: "100%",
        overflow: "hidden",
        paddingLeft: "10px",
        // width: "fit-content",
        "&:hover": {
          overflow: "auto",
        },
        "::-webkit-scrollbar": {
          width: "5px",
          height: "5px",
        },
      }}
    >
      <Table stickyHeader={true} sx={{ width: "fit-content" }}>
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              fontSize: "0.75rem",
              fontWeight: "600",
              color: "primary.main",
              padding: "2px 9px 7px 0px ",
              backgroundColor: "white",
              lineHeight: "normal",
              letterSpacing: "normal",
              fontFamily:
                " -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
            },
          }}
        >
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                borderBottom: "0px",
              },
            }}
          >
            <GetHeaders />
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& .MuiTableCell-root": {
              fontSize: "0.75rem",
              padding: "0px 10px 0px 25px ",
              whiteSpace: "nowrap",
              maxWidth: "250px",
              minWidth: "75px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              backgroundColor: "white",
              color: "primary.contrastText",
              fontFamily:
                "  'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
            },
          }}
        >
          {SampleRecords && SampleRecords.length > 0 ? (
            getRowsData()
          ) : (
            <div
              className="axisInfo"
              style={{
                flex: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.primary.contrastText,
              }}
            >
              Select any table from the list on left to show records here
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const mapStateToProps = (
  state: SampleRecordsState & TabTileStateProps2 & any,
  ownProps: any
) => {
  return {
    tableRecords: state.sampleRecords,
    tabTileProps: state.tabTileProps,
    calculations: state.calculations,
    chartProperties: state.chartProperties,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    editCalculationFunc: (propKey: string, calculationFieldName: string) =>
      dispatch(editSavedCalculation(propKey, calculationFieldName)),
    deleteCalculationFunc: (calculationFieldName: string, propKey: string) =>
      dispatch(deleteSavedCalculation(calculationFieldName, propKey)),
    addRecords: (
      id: string,
      tableId: string,
      tableRecords: any,
      columnType: any
    ) => dispatch(addTableRecords(id, tableId, tableRecords, columnType)),
    deleteItemFromChartFunc: (
      propKey: string,
      binIndex: number,
      itemIndex: number
    ) => dispatch(deleteItemInChartProp(propKey, binIndex, itemIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayTable);
