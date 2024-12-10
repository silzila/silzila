// This component is part of Dataset Create / edit page
// Present in the very bottom of the page
// Used for naming the dataset & saving it

import { Close } from "@mui/icons-material";
import { Button, Dialog, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetState } from "../../redux/DataSet/datasetActions";
import { useNavigate } from "react-router-dom";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import FetchData from "../ServerCall/FetchData";
import { Dispatch } from "redux";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
  ArrowsProps,
  DataSetStateProps,
  RelationshipsProps,
  tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import {
  BottomBarProps,
  IDataSetCreatePayLoad,
  IFilter,
  IFilterPanel,
  IRelationship,
  ITable,
} from "./BottomBarInterfaces";
import { AlertColor } from "@mui/material/Alert";

import { TextFieldBorderStyle } from "../DataConnection/muiStyles";
import { CircularProgress } from "@mui/material";
const BottomBar = ({
  //props
  editMode,
  datasetFilterArray,

  // state
  tempTable,
  arrows,
  relationships,
  token,
  connection,
  dsId,
  isFlatFile,
  datasetName,
  database,

  // dispatch
  resetState,
}: BottomBarProps) => {
  const [fname, setFname] = useState<string>(datasetName);
  const [sendOrUpdate, setSendOrUpdate] = useState<string>("Save");
  const [open, setOpen] = useState<boolean>(false);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const navigate = useNavigate();

  const tablesWithoutRelation: string[] = [];

  useEffect(() => {
    if (editMode) {
      setSendOrUpdate("Update");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // check  if pass values for filters are corrct or not
  const validValues = (): Boolean => {
    for (let i = 0; i < datasetFilterArray.length; ++i) {
      const elem = datasetFilterArray[i];

      if (
        elem.filterType === "searchCondition" &&
        elem.operator === "between"
      ) {
        if (
          (elem.dataType === "integer" ||
            elem.dataType === "float" ||
            elem.dataType === "decimal") &&
          Number(elem.userSelection[0]) > Number(elem.userSelection[1])
        )
          return false;
        if (
          (elem.dataType === "date" || elem.dataType === "timestamp") &&
          elem.timeGrain === "date" &&
          new Date(elem.userSelection[0]) > new Date(elem.userSelection[1])
        )
          return false;
        if (
          (elem.dataType === "date" || elem.dataType === "timestamp") &&
          Number(elem.userSelection[0]) > Number(elem.userSelection[1])
        )
          return false;
        if (
          elem.dataType === "text" &&
          elem.userSelection[0] > elem.userSelection[1]
        )
          return false;
      }
    }
    return true;
  };
  /**
 * 
 * @param filter selected by the user 
 * @returns modified filters as per the API requirements
  
 */
  const modifyFilters = (filter: IFilter): IFilterPanel => {
    // filter type of API is in camelCase
    if (filter.filterType === "pickList") {
      return {
        panelName: "dataSetFilters",
        shouldAllConditionsMatch: true,
        filters: [
          {
            filterType: "pickList",
            tableId: filter.tableId,
            fieldName: filter.fieldName,
            dataType: filter.dataType,
            operator: "in",
            shouldExclude: filter.shouldExclude,
            userSelection: filter.userSelection,
            uid: filter.uid,
            tableName: filter.tableName,
            ...(filter.dataType === "date" || filter.dataType === "timestamp"
              ? { timeGrain: filter.timeGrain }
              : {}),
          },
        ],
      };
    } else if (filter.filterType === "searchCondition") {
      return {
        panelName: "dataSetFilters",
        shouldAllConditionsMatch: true,
        filters: [
          {
            dataType: filter.dataType,
            fieldName: filter.fieldName,
            filterType: "searchCondition",
            operator: filter.operator,
            shouldExclude: filter.shouldExclude,
            tableId: filter.tableId,
            tableName: filter.tableName,
            isTillDate: filter.isTillDate,
            userSelection: filter.userSelection,
            uid: filter.uid,
            ...(filter.dataType === "date" || filter.dataType === "timestamp"
              ? { timeGrain: filter.timeGrain }
              : {}),
          },
        ],
      };
    } else {
      return {
        panelName: "dataSetFilters",
        shouldAllConditionsMatch: true,
        filters: [
          {
            dataType: filter.dataType,
            relativeCondition: {
              from: filter.relativeCondition?.from ?? [],
              to: filter.relativeCondition?.to ?? [],
              anchorDate:
                filter.relativeCondition?.anchorDate === "specificDate"
                  ? filter.userSelection[0]?.toString() || "" // Fallback to empty string if undefined
                  : filter.relativeCondition?.anchorDate || "",
            },
            fieldName: filter.fieldName,
            isTillDate: filter.isTillDate,
            uid: filter.uid,
            operator: "between",
            userSelection: [],
            shouldExclude: filter.shouldExclude,
            filterType: "relativeFilter",
            tableId: filter.tableId,
            tableName: filter.tableName,
            timeGrain: "date",
          },
        ],
      };
    }
  };
  const checkTableRelationShip = async (
    selectedTables: ITable[],
    tablesWithRelation: string[]
  ) => {
    if (selectedTables.length > 1) {
      selectedTables.forEach((el: ITable) => {
        if (!tablesWithRelation.includes(el.table)) {
          tablesWithoutRelation.push(el.table);
        }
      });
    }

    // If there is a table without relation, show a warning
    if (tablesWithoutRelation.length !== 0) {
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage(
        "Error: Every table should have atleast one relationship.\n" +
          "tables with no Relationship\n" +
          tablesWithoutRelation.map((el: string) => "\n" + el)
      );
      // setTimeout(() => {
      // 	setOpenAlert(false);
      // 	setTestMessage("");
      // }, 4000);
    }

    // case where there is only one table and no relations or
    // if all the tables have relations defined,
    // prepare data to be saved in server and submit
    let tableRelationships: IRelationship[] = [];

    if (
      tablesWithoutRelation.length === 0 ||
      (selectedTables.length === 1 && relationships.length === 0)
    ) {
      relationships.forEach((relation: RelationshipsProps) => {
        let tableRelation: IRelationship = {
          table1: relation.startId,
          table2: relation.endId,
          cardinality: relation.cardinality,
          refIntegrity: relation.integrity,
          table1Columns: [],
          table2Columns: [],
        };

        let arrowsForRelation: ArrowsProps[] = [];
        arrowsForRelation = arrows.filter(
          (arr: ArrowsProps) => arr.relationId === relation.relationId
        );
        let tbl1: string[] = [];
        let tbl2: string[] = [];
        arrowsForRelation.forEach((arr: ArrowsProps) => {
          tbl1.push(arr.startColumnName);
          tbl2.push(arr.endColumnName);
        });

        tableRelation.table1Columns = tbl1;
        tableRelation.table2Columns = tbl2;

        tableRelationships.push(tableRelation);
      });
      var apiurl: string;

      if (editMode) {
        apiurl = "dataset/" + dsId;
      } else {
        apiurl = "dataset";
      }
      //for datasetFilter array sent the data in the form of array
      if (!validValues()) {
        setTestMessage("Invalid Values for filters");
        setSeverity("error");
        setOpenAlert(true);
        return;
      }
      const datasetFilter: IFilterPanel[] = datasetFilterArray.map(
        (item): IFilterPanel => {
          return modifyFilters(item);
        }
      );

      if (tableRelationships.length >= 0) {
        const payLoad: IDataSetCreatePayLoad = {
          connectionId: isFlatFile ? "" : connection,
          datasetName: fname,
          isFlatFileData: isFlatFile,
          dataSchema: {
            tables: selectedTables,
            relationships: tableRelationships,
            filterPanels: datasetFilter,
          },
        };
        var options: any = await FetchData({
          requestType: "withData",
          method: editMode ? "PUT" : "POST",
          // method: "PUT",
          url: apiurl,
          // url:"filter-options?datasetid=" + dsId+"&dbconnectionid="+connection,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: payLoad,
        });
      } else {
        setTestMessage(
          "Error: Every table should have atleast one relationship.\n" +
            "tables with no Relationship\n" +
            tempTable.map((el: any) => "\n," + el.tableName)
        );

        setSeverity("error");
        setOpenAlert(true);
      }
      // let options={
      //   status:"",
      //   data:{
      //     message:""
      //   }
      // }
      if (options.status) {
        setSeverity("success");
        setOpenAlert(true);
        setTestMessage("Saved Successfully!");
        setTimeout(() => {
          setOpenAlert(false);
          setTestMessage("");
          navigate("/datahome");
        }, 2000);
      } else {
        setSeverity("error");
        setOpenAlert(true);

        setTestMessage(options.data.message);
        // setTestMessage("not have any relationId")
        // setTimeout(() => {
        // 	setOpenAlert(false);
        // 	setTestMessage("");
        // }, 4000);
      }
    }

    // Potential repeat of code in above section
    // if (tablesInDataSet.length > 1 && relationships.length === 0) {
    // 	setSeverity("error");
    // 	setOpenAlert(true);
    // 	setTestMessage(
    // 		"Error: Every table should have atleast one relationship.\n" +
    // 			"tables with no Relationship\t" +
    // 			tablesWithoutRelation.map((el) => el)
    // 	);
    // 	setTimeout(() => {
    // 		setOpenAlert(false);
    // 		setTestMessage("");
    // 	}, 4000);
    // }
  };
  // After send/update button is clicked
  const onSendData = () => {
    // If dataset name is provided,
    // prepare the tables with relations list and
    // check if table relationships and arrows meet requirements
    if (fname !== "") {
      setDisableBtn(true);
      const tablesSelectedInSidebar: any[] =
        // tablesSelectedInSidebarProps[]
        tempTable.map((el: tableObjProps) => {
          return {
            table: el.tableName,
            schema: el.schema,
            id: el.id,
            alias: el.alias,
            tablePositionX: el.tablePositionX,
            tablePositionY: el.tablePositionY,
            database: el.databaseName,
            flatFileId: isFlatFile ? el.table_uid : "",
            isCustomQuery: el.isCustomQuery || false,
            customQuery: el.customQuery || "",
          };
        });
      const listOfStartTableNames: string[] = [];
      const listOfEndTableNames: string[] = [];
      arrows.forEach((el: ArrowsProps) => {
        listOfStartTableNames.push(el.startTableName);
        listOfEndTableNames.push(el.endTableName);
      });
      const tablesWithRelation: string[] = [
        ...listOfStartTableNames,
        ...listOfEndTableNames,
      ];

      checkTableRelationShip(
        tablesSelectedInSidebar as ITable[],
        tablesWithRelation
      );
      setDisableBtn(false);
    } else {
      // If dataSet name is not provided, show error
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage("Please Enter A Dataset Name");
      // setTimeout(() => {
      // 	setOpenAlert(false);
      // 	setTestMessage("");
      // }, 4000);
    }
  };

  const onCancelOnDataset = () => {
    setOpen(true);
  };

  return (
    <div className="bottomBar">
      <Button
        variant="contained"
        onClick={onCancelOnDataset}
        id="cancelButton"
        sx={{ textTransform: "none" }}
        disabled={disableBtn}
      >
        {editMode ? "Back" : "Cancel"}
      </Button>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Tooltip
          title="Click to Edit"
          sx={{
            "& .MuiTextField-root": { margin: 1, width: "20px" },
          }}
        >
          <TextField
            sx={{
              flex: 1,
              margin: "auto 20px",
              maxWidth: "200px",
              '& label.Mui-focused': {
                color: '#2bb9bb',
              },
              '& label:hover': {
                color: '#2bb9bb',
              },
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2bb9bb',
                },
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: '#2bb9bb',
              },
            }}
            inputProps={{
              style: {
                fontSize: "14px",
                color: "#3B3C36",
              },
            }}
            InputProps={TextFieldBorderStyle}
            id="outlined-size-small"
            size="small"
            onChange={(e) => {
              e.preventDefault();
              setFname(e.target.value);
            }}
            value={fname}
            label="Dataset Name"
          />
        </Tooltip>

        <Button
          variant="contained"
          disabled={disableBtn}
          onClick={onSendData}
          id="setButton"
          sx={{
            textTransform: "none",
          }}
          style={{ backgroundColor: "#2BB9BB" }}
        >
          {disableBtn ? (
            <CircularProgress size={20} color="info" />
          ) : (
            sendOrUpdate
          )}
        </Button>
      </div>

      <NotificationDialog
        onCloseAlert={() => {
          setOpenAlert(false);
          setTestMessage("");
        }}
        severity={severity}
        testMessage={testMessage}
        openAlert={openAlert}
      />

      <Dialog open={open}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "5px",
            width: "350px",
            height: "auto",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: "bold", textAlign: "center" }}>
            {editMode ? "CANCEL DATASET EDIT" : "CANCEL DATASET CREATION"}
            <Close style={{ float: "right" }} onClick={() => setOpen(false)} />
            <br />
            <br />
            <p style={{ fontWeight: "normal" }}>
              {editMode
                ? "Any unsaved changes will be discarded, do you want to exit anyway?"
                : "Cancel will reset this dataset creation. Do you want to discard the progress?"}
            </p>
          </div>
          <div
            style={{
              padding: "15px",
              justifyContent: "space-around",
              display: "flex",
            }}
          >
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={() => {
                resetState();
                setOpen(false);
                if (editMode) {
                  navigate("/dataHome");
                }
              }}
            >
              Ok
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
  return {
    token: state.isLogged.accessToken,
    tempTable: state.dataSetState.tempTable,
    arrows: state.dataSetState.arrows,
    relationships: state.dataSetState.relationships,
    connection: state.dataSetState.connection,
    datasetName: state.dataSetState.datasetName,
    dsId: state.dataSetState.dsId,
    database: state.dataSetState.databaseName,
    isFlatFile: state.dataSetState.isFlatFile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    resetState: () => dispatch(resetState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
