// This component is part of Dataset Create / edit page
// Present in the very bottom of the page
// Used for naming the dataset & saving it

import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { resetState } from "../../redux/DataSet/datasetActions";
import { useNavigate } from "react-router-dom";
import {
  NotificationDialog,
  PopUpSpinner,
} from "../CommonFunctions/DialogComponents";
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
  relationshipServerObjProps,
  tablesSelectedInSidebarProps,
} from "./BottomBarInterfaces";
import { AlertColor } from "@mui/material/Alert";

import { TextFieldBorderStyle } from "../DataConnection/muiStyles";
import Logger from "../../Logger";
import RichTreeViewControl from "../Controls/RichTreeViewControl";
import {
  ConvertListOfListToRichTreeViewList,
  GetWorkSpaceDetails,
  isNameAllowed,
} from "../CommonFunctions/CommonFunctions";
import { useLocation } from "react-router-dom";
import { fontSize, palette } from "../..";
import { TContentDetails } from "./types";
import { messages, permissions, roles } from "../CommonFunctions/aliases";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

const BottomBar = ({
  //props
  editMode,

  // state
  tempTable,
  arrows,
  relationships,
  token,
  connection,
  dsId,
  datasetName,
  database,
  isFlatFile,
  datasetFilterArray,

  // dispatch
  resetState,
}: BottomBarProps) => {
  const [isSubWorkspaceSelected, setIsSubWorkspaceSelected] =
    useState<boolean>(false);
  const [fname, setFname] = useState<string>(datasetName);
  const [sendOrUpdate, setSendOrUpdate] = useState<string>("Save");
  const [open, setOpen] = useState<boolean>(false);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [subWorkspaceList, setSubWorkspaceList] = useState<Array<Object>>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [showWorkSpace, setShowWorkSpace] = useState<boolean>(false);
  const location = useLocation();
  const state = location.state;
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/")
    }
  }, [state, navigate])

  const tablesWithoutRelation: string[] = [];
  const [viewerRestriction, setViewerRestriction] = useState<boolean>(false);
  // const {workspaceContents,SubWorkspaceContents}=useSelector((state: RootState) => state.permissions)
  // const permission=useSelector((state:RootState)=>state.dataSetState.permission);
  useEffect(() => {
    if (!editMode || !dsId) return;
    // const allContents=[...workspaceContents,...SubWorkspaceContents];
    // const selectedDs=allContents.find((item:any)=>item.id===dsId);
    // if(!selectedDs)return;
    // if(selectedDs.levelId===permissions.view)setViewerRestriction(true);
    // else if(selectedDs.roleName===roles.CustomCreator && selectedDs.levelId===permissions.view)setViewerRestriction(true);
    // if(permission.levelId===permissions.view||permission.levelId===permissions.restricted)setViewerRestriction(true);
    // else if(permission.roleName===roles.CustomCreator && permission.levelId===permissions.view)setViewerRestriction(true);
    // else setViewerRestriction(false);


  }, [dsId, editMode]);
  useEffect(() => {
    if (selectedWorkspace !== "") {
      onSendData();
      setShowWorkSpace(false);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (state?.mode === "New") {
      setSendOrUpdate("Save");
      setFname("");
    }
  }, [state?.mode]);

  const getAllSubworkspace = async () => {
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `workspaces/tree`,
      headers: { Authorization: `Bearer ${token}` },
    });

    let list = [];

    if (result.status) {
      list = result.data;
    } else {
      Logger("error", result.data.detail);
    }

    setSubWorkspaceList(ConvertListOfListToRichTreeViewList(list));
  };

  const handleProceedButtonClick = (selectedWorkspaceID: string, list: any) => {
    if (!selectedWorkspaceID) {
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage("Select a workspace.");
      return;
    }

    setIsSubWorkspaceSelected(
      !list.find((item: any) => item.id === selectedWorkspaceID)
    );

    setSelectedWorkspace(selectedWorkspaceID);
  };

  useEffect(() => {
    if (editMode) {
      setSendOrUpdate("Update");
    } else {
      getAllSubworkspace();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!state) {
    return null;
  }

  // Check if every table has atleast one relationship before submitting the dataset
  const checkTableRelationShip = async (
    tablesSelectedInSidebar: tablesSelectedInSidebarProps[],
    tablesWithRelation: string[]
  ) => {
    let workspaceId = selectedWorkspace || state?.parentId;
    setSelectedWorkspace("");

    if (tablesSelectedInSidebar.length > 1) {
      tablesSelectedInSidebar.forEach((el: tablesSelectedInSidebarProps) => {
        if (tablesWithRelation.includes(el.table)) {
        } else {
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
    var relationshipServerObj: relationshipServerObjProps[] = [];

    if (
      tablesWithoutRelation.length === 0 ||
      (tablesSelectedInSidebar.length === 1 && relationships.length === 0)
    ) {
      relationships.forEach((relation: RelationshipsProps) => {
        var relationObj: relationshipServerObjProps = {
          table1: relation.startId,
          table2: relation.endId,
          cardinality: relation.cardinality,
          refIntegrity: relation.integrity,
          table1Columns: [],
          table2Columns: [],
        };

        var arrowsForRelation: ArrowsProps[] = [];
        arrowsForRelation = arrows.filter(
          (arr: ArrowsProps) => arr.relationId === relation.relationId
        );
        var tbl1: string[] = [];
        var tbl2: string[] = [];
        arrowsForRelation.forEach((arr: ArrowsProps) => {
          tbl1.push(arr.startColumnName);
          tbl2.push(arr.endColumnName);
        });

        relationObj.table1Columns = tbl1;
        relationObj.table2Columns = tbl2;

        relationshipServerObj.push(relationObj);
      });

      var apiurl: string;

      if (editMode) {
        apiurl = `dataset/${dsId}?workspaceId=${workspaceId}`;
      } else {
        apiurl = `dataset?workspaceId=${workspaceId}`;
      }
      // for datasetFilter array sent the data in the form of array
      const datasetFilter = datasetFilterArray.map((item) => {
        var excludeInclude: boolean =
          item.shouldExclude === false ? false : true;
        return {
          panelName: "dataSetFilters",
          shouldAllConditionsMatch: true,
          filters: [
            {
              filterType: item.filterType,
              fieldName: item.fieldName,
              tableName: item.tableName,
              dataType: item.dataType,
              uid: item.uid,
              relativeCondition: item.filterType === "relativeFilter" ? { from: item.relativeCondition?.from ?? [], to: item.relativeCondition?.to ?? [], anchorDate: item.relativeCondition?.anchorDate === "specificDate" ? item.userSelection[0]?.toString() || "" : item.relativeCondition?.anchorDate || "" } : undefined,
              displayName: item.displayName,
              shouldExclude: excludeInclude,
              timeGrain: item.filterType === "relativeFilter" ? "date" : item.timeGrain,
              operator: item.filterType === "pickList" ? "in" : item.operator,
              userSelection: item.userSelection,
              isTillDate: item.isStillData,
              tableId: item.tableId,
              exprType: item.exprType,
            },
          ],
        };
      });

      if (relationshipServerObj.length >= 0) {
        // TODO: need to specify type
        setLoading(true);
        var options: any = await FetchData({
          requestType: "withData",
          method: editMode ? "PUT" : "POST",
          url: apiurl,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            connectionId: isFlatFile ? "" : connection,
            datasetName: fname,
            isFlatFileData: isFlatFile,
            dataSchema: {
              tables: tablesSelectedInSidebar,
              relationships: relationshipServerObj,
              filterPanels: datasetFilter,
            },
          },
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

      if (options.status) {
        setLoading(false);
        setSeverity("success");
        setOpenAlert(true);
        setTestMessage("Saved Successfully!");

        setTimeout(() => {
          setOpenAlert(false);
          setTestMessage("");

          if (sendOrUpdate === "Update") {
            navigate(-1);
          } else {
            if (isSubWorkspaceSelected) {
              let workspaceDetail: any = GetWorkSpaceDetails(
                subWorkspaceList,
                workspaceId,
                true
              );
              localStorage.setItem("workspaceName", workspaceDetail?.label);
              localStorage.setItem(
                "childWorkspaceName",
                workspaceDetail.subLabel
              );
              // localStorage.setItem("parentId", workspaceId);
              const childWorkspaceName = localStorage.getItem("childWorkspaceName")

              navigate(`/SubWorkspaceDetails/${workspaceId}`, { state: { childWorkspaceName } });
              resetState();
            } else {
              let workspaceDetail: any = GetWorkSpaceDetails(
                subWorkspaceList,
                workspaceId
              );
              localStorage.setItem("workspaceName", workspaceDetail?.label);
              localStorage.setItem("parentId", workspaceId);

              navigate(`/workspace/${workspaceId}`);
              resetState();
            }
          }
        }, 2000);
      } else {
        setLoading(false);
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
    // if (tablesSelectedInSidebar.length > 1 && relationships.length === 0) {
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
    if (isNameAllowed(fname)) {
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

      checkTableRelationShip(tablesSelectedInSidebar, tablesWithRelation);
    } else {
      // If dataSet name is not provided, show error
      setSeverity("error");
      setOpenAlert(true);
      setTestMessage(messages.dataset.wrongName);
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
    <Box
      sx={{
        height: "3.5rem",
        borderTop: "1px solid #E0E0E0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 99,
        backgroundColor: palette.secondary.contrastText,
        paddingInline: "0.5rem",
      }}
    >
      {showWorkSpace ? (
        <RichTreeViewControl
          currentWorkspace={state?.parentId}
          proceedButtonName={"Save"}
          list={subWorkspaceList}
          title={"Select a Workspace"}
          showInPopup={showWorkSpace}
          handleCloseButtonClick={(e: any) => {
            setShowWorkSpace(false);
          }}
          handleProceedButtonClick={handleProceedButtonClick}
        ></RichTreeViewControl>
      ) : null}

      <Button
        variant="contained"
        onClick={onCancelOnDataset}
        id="cancelButton"
        sx={{
          textTransform: "none",
          fontSize: fontSize.medium,
          lineHeight: "normal",
          marginRight: 0,
        }}
      >
        {editMode ? "Back" : "Cancel"}
      </Button>

      <Box
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "1.625rem",
        }}
      >
        <Tooltip
          title={editMode && viewerRestriction ? 'You are not allowed to make any changes' : "Click to Edit"}
          sx={{
            "& .MuiTextField-root": { margin: 1, width: "20px" },
          }}
        >
          <TextField
            disabled={editMode && viewerRestriction}
            id="margin-none"
            sx={{
              flex: 1,
              margin: "0 20px",
              maxWidth: "200px",
              fontSize: fontSize.medium,
              "& label.Mui-focused": {
                color: "#2bb9bb",
                transform: "translate(14px, -4.5px) scale(0.75)",
              },
              "& label:hover": {
                color: "#2bb9bb",
              },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#2bb9bb",
                },
              },
              "& label": {
                fontSize: fontSize.medium,
                color: palette.primary.contrastText,
                transform: "translate(14px, 4.5px) scale(1)",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "#2bb9bb",
              },
            }}
            inputProps={{
              style: {
                fontSize: fontSize.medium,
                padding: "0 12px", // Adjust padding for better alignment
                color: palette.primary.contrastText,
                lineHeight: "1.5", // Ensure line-height matches your design
              },
            }}
            InputProps={{
              style: {
                height: "1.625rem",
              },
            }}
            size="small"
            onChange={(e) => {
              e.preventDefault();
              setFname(e.target.value);
            }}
            value={fname}
            label={fname === "" ? "Dataset Name" : ""}
          />
        </Tooltip>

        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            if (!isNameAllowed(fname)) {
              setSeverity("error");
              setOpenAlert(true);
              setTestMessage(messages.dataset.wrongName);
              return;
            }
            if (tempTable.length === 0) {
              setSeverity("error");
              setOpenAlert(true);
              setTestMessage("Please add atleast one table");
              return;
            }
            if (arrows.length === 0 && tempTable.length > 1) {
              setSeverity("error");
              setOpenAlert(true);
              setTestMessage(
                "Error: Every table should have atleast one relationship.\n" +
                "tables with no Relationship\n"
              );
              return;
            }
            if (sendOrUpdate === "Update") {
              onSendData();
            } else {
              setShowWorkSpace(true);
            }
          }}
          id="setButton"
          sx={{
            textTransform: "none",
            fontSize: fontSize.medium,
            lineHeight: "normal",
            marginRight: '0.2rem',
            cursor: viewerRestriction ? 'not-allowed' : 'pointer',
            '&:disabled': {
              cursor: 'not-allowed',
              pointerEvents: 'auto'
            }
          }}
          disabled={viewerRestriction}
          style={{ backgroundColor: "#2BB9BB" }}
        >
          {sendOrUpdate}
        </Button>
      </Box>

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
            padding: "10px",
            width: "350px",
            height: "auto",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: "bold", textAlign: "center", padding: "0.5rem" }}>
            <div style={{
              fontSize: fontSize.large
            }}>
              {editMode ? "CANCEL DATASET EDIT" : "CANCEL DATASET CREATION"}
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'right' }}
                onClick={() => setOpen(false)}
              >
                <Close />
              </button>
            </div>
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
              sx={{
                backgroundColor: "white",
                border: "1px solid gray",
                marginLeft: "8px",
                width: "105px",
                fontSize: fontSize.medium,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "gray",
                  color: "white",
                },
              }}
              variant="contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "white",
                border: "1px solid red",
                marginLeft: "8px",
                width: "105px",
                fontSize: fontSize.medium,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
              }}
              variant="contained"
              onClick={() => {
                resetState();
                setOpen(false);
                // if (editMode) {
                navigate(-1);
                //}
              }}
            >
              Ok
            </Button>
            {/* <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={() => {
                resetState();
                setOpen(false);
                // if (editMode) {
                navigate(-1);
                //}
              }}
            >
              Ok
            </Button> */}
          </div>
        </div>
      </Dialog>
      <PopUpSpinner
        show={loading}
        paperProps={{ style: { marginLeft: "16.7rem" } }}
      />
    </Box>
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
