// This component returns Individual table along with column names to be displayed in Canvas
// Tables can be given a friendly name by the user
// These tables are draggable

import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { connect, useSelector } from "react-redux";
import { useXarrow } from "react-xarrows";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CanvasTableColumns from "./CanvasTableColumns";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import {
  actionsOnRemoveTable,
  addArrows,
  addNewRelationship,
  setTempTables,
  updateRelationship,
} from "../../redux/DataSet/datasetActions";
import ShortUniqueId from "short-unique-id";
import ActionPopover from "./ActionPopover";
import { Button, TextField } from "@mui/material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import {
  ArrowsProps,
  DataSetStateProps,
  RelationshipsProps,
  tableObjProps,
  UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { CanvasTablesProps, RelationObjProps } from "./CanvasTablesIntefaces";
import { newArrowObj } from "./CanvasInterfaces";
import { ColumnsWithUid } from "./DatasetInterfaces";
import { AlertColor } from "@mui/material/Alert";
import { fontSize } from "../..";
import { permissions, roles } from "../CommonFunctions/aliases";
import { TContentDetails } from "./types";
import { RootState } from "../../redux";

const CanvasTables = ({
  // props
  tableData,
  editMode=false,

  // state
  // dataSetState,
  arrows,
  tempTable,
  relationships,
  tables,
  views,
  dsId,

  // dispatch
  addNewRelationship,
  addArrows,
  actionsOnRemoveTable,
  setTempTables,
}: CanvasTablesProps) => {
  //TODO not sure about ref type,need to specify type
  const dragRef = useRef<any>();
  const updateXarrow = useXarrow();

  const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
  const [arrowProp, setArrowProp] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [tableId, setTableId] = useState<string>("");
  // TODO need to specify type
  const [anchorEl, setAnchorEl] = useState<any>();
  const [inputField, setInputField] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [severity, setseverity] = useState<AlertColor>("success");
  const [testMessage, setTestMessage] = useState<string>("");
   const [viewerRestriction,setViewerRestriction]=useState<boolean>(false);
  // const [startPosition, setStartPosition] = useState({ x, y });
  
  const [x, setX] = useState<number | any>(
    tableData.tablePositionX ? tableData.tablePositionX : 0
  );
  const [y, setY] = useState<number | any>(
    tableData.tablePositionY ? tableData.tablePositionY : 0
  );
  // const {workspaceContents,SubWorkspaceContents}=useSelector((state: RootState) => state.permissions)
    useEffect(() => {
      if(!editMode||!dsId)return;
  
      // const allContents=[...workspaceContents,...SubWorkspaceContents];
      // const selectedDs=allContents.find((item:any)=>item.id===dsId);
      // if(!selectedDs)return;
      // if(selectedDs.levelId===permissions.view)setViewerRestriction(true);
      // else if(selectedDs.roleName===roles.CustomCreator && selectedDs.levelId===permissions.view)setViewerRestriction(true);
      // if(permission.levelId===permissions.view||permission.levelId===permissions.restricted)setViewerRestriction(true);
      // else if(permission.roleName===roles.CustomCreator && permission.levelId===permissions.view)setViewerRestriction(true);
      // else setViewerRestriction(false);   
    },[dsId, editMode]);
  var uid = new ShortUniqueId({ length: 8 });

  // when a new arrow is created,check if there is alerady a relation between the two tables of this new arrow
  // If yes, add arrow & link existing relationId
  // If no,
  // 		- open relation popover and get info.
  // 		- Create new relation id
  // 		- Save new arrow and new relation

  // TODO: need to specify type for newArrowObj after testing
  const checkRelationExists = (newArrowObj: newArrowObj) => {
    // if there are no arrows yet between these two tables, add arrow and show popup to define relationship
    if (arrows.length === 0) {
      newArrowObj.relationId = uid();
      setArrowProp(newArrowObj);
      setShowRelationCard(true);
    } else {
      var sameRel = false;
      var sameRelInv = false;

      var sameRelObj = {};
      var sameRelInvObj = {};

      relationships.forEach((rel: RelationshipsProps, i: number) => {
        // check if the relationship already exist by checking
        // if the start table and end table matches between the new arrow and existing realtionships

        if (
          rel.startId === newArrowObj.startId &&
          rel.endId === newArrowObj.endId
        ) {
          newArrowObj.relationId = rel.relationId;
          newArrowObj.cardinality = rel.cardinality;
          newArrowObj.integrity = rel.integrity;
          newArrowObj.showHead = rel.showHead;
          newArrowObj.showTail = rel.showTail;
          sameRel = false;
          sameRelObj = newArrowObj;
        } else if (
          rel.startId === newArrowObj.endId &&
          rel.endId === newArrowObj.startId
        ) {
          // If it is in reverse assign the start and end table parameters in reverse

          newArrowObj.relationId = rel.relationId;
          var newReverseArrowObj = JSON.parse(JSON.stringify(newArrowObj));

          newReverseArrowObj.startTableName = newArrowObj.endTableName;
          newReverseArrowObj.startColumnName = newArrowObj.endColumnName;
          newReverseArrowObj.start = newArrowObj.end;
          newReverseArrowObj.table1_uid = newArrowObj.table2_uid;
          newReverseArrowObj.startSchema = newArrowObj.endSchema;

          newReverseArrowObj.endTableName = newArrowObj.startTableName;
          newReverseArrowObj.endColumnName = newArrowObj.startColumnName;
          newReverseArrowObj.end = newArrowObj.start;
          newReverseArrowObj.table2_uid = newArrowObj.table1_uid;
          newReverseArrowObj.endSchema = newArrowObj.startSchema;

          newReverseArrowObj.relationId = rel.relationId;
          newReverseArrowObj.cardinality = rel.cardinality;
          newReverseArrowObj.integrity = rel.integrity;
          newReverseArrowObj.showHead = rel.showHead;
          newReverseArrowObj.showTail = rel.showTail;

          sameRelInv = false;
          sameRelInvObj = newReverseArrowObj;
        }
      });

      if (sameRel) {
        addArrows(sameRelObj);
      }
      if (sameRelInv) {
        addArrows(sameRelInvObj);
      }

      if (!sameRel && !sameRelInv) {
        newArrowObj.relationId = uid();
        setArrowProp(newArrowObj);
        setShowRelationCard(true);
      }
    }
  };

  const addRelationship = (relObj: RelationObjProps) => {
    addNewRelationship(relObj);
  };

  // Remove or rename tables in canvas
  // TODO: need to specify type
  const selectAction = (e: any) => {
    if (open === true) {
      // Remove table from canvas
      if (parseInt(e.target.id) === 1) {
        // get ID of table listed in canvas
        const tempTables: tableObjProps[] = [...tempTable].filter(
          (tab: tableObjProps) => {
            return tab.id !== tableId;
          }
        );

        // remove checked state of the table from Sidebar
        const tables1: UserTableProps[] = [...tables].map(
          (tab: UserTableProps) => {
            if (tab.id === tableId) {
              tab.isSelected = false;
            }
            return tab;
          }
        );
        const views1: any[] = [...views].map((tab: any) => {
          if (tab.id === tableId) {
            tab.isSelected = false;
          }
          return tab;
        });
        var table3 = tableData["isView"] ? views1 : tables1;
        // Remove this table's info from Relationship information
        var is_in_relationship: any = relationships.filter(
          (obj: RelationshipsProps) =>
            obj.startId === tableId || obj.endId === tableId
        )[0];
        if (is_in_relationship) {
          var yes = window.confirm(
            "are you sure you want to remove this table?"
          );
          if (yes) {
            actionsOnRemoveTable(tempTables, table3, tableId);
          }
        } else {
          actionsOnRemoveTable(tempTables, table3, tableId);
        }
      } else if (parseInt(e.target.id) === 2) {
        // Rename table alias in canvas
        setNewName(tableData.alias);
        setInputField(true);
      }
    } else {
      alert("Actions not Set");
    }
    setOpen(false);
  };

  // Focusing the input text field during rename of table
  const selectText = () => {
    var input: any = document.getElementById("name");
    input?.select();
  };

  // When changing name of a table, make sure that it is not empty
  // const changeTableName = (tableId: string) => {
  // 	var spaceCount = newName.split(" ").length - 1;
  // 	if (newName.length > 0 && newName.length !== spaceCount) {
  // 		const newTable = [...tempTable].map((tab: tableObjProps) => {
  // 			if (tab.table_uid === tableId) {
  // 				tab.alias = newName;
  // 			}
  // 			return tab;
  // 		});
  // 		setTempTables(newTable);
  // 		setNewName("");
  // 		setInputField(false);
  // 	} else {
  // 		setOpenAlert(true);
  // 		setseverity("error");
  // 		setTestMessage("Atleast one letter should be provided");
  // 		// setTimeout(() => {
  // 		// 	setOpenAlert(false);
  // 		// 	setTestMessage("");
  // 		// }, 4000);
  // 	}
  // };
  const changeTableName = (tableId: string) => {
    // Count the number of spaces in the newName
    var spaceCount = newName.split(" ").length - 1;

    // Check if newName is not empty and not just spaces
    if (newName.length > 0 && newName.length !== spaceCount) {
      // Check if the newName already exists in tempTable
      const previousTableInfo = tempTable.find((tab: any) => tab.table_uid === tableId);
      // const previousTableName = previousTable ? previousTable.tableName : "";
      // console.log("previousTableName", previousTableName);
      const isDuplicate = tempTable.some(
        (tab: tableObjProps) =>
          tab.alias === newName && tab.table_uid !== tableId
      );

      if (isDuplicate) {
        setOpenAlert(true);
        setseverity("error");
        setTestMessage("Table name already exists");
      } else {
        const newTempTables = tempTable.map((tab: tableObjProps) => {
          if (tab.table_uid === tableId) {
            return { ...tab, alias: newName };
          }
          return tab;
        });
        //change relationship name
        //find relation ship array which is related to
        const findRelation = arrows.filter((item: ArrowsProps) => {
          return (
            item.startTableName === previousTableInfo?.alias ||
            item.endTableName === previousTableInfo?.alias
          );
        });
        const clonedRelations = findRelation.map(item => ({
          ...item,
        }));
        //update name in relationship arrow
        if (clonedRelations.length > 0) {
          clonedRelations.forEach((item: ArrowsProps) => {
            let updated = false;
        
            if (item.startTableName === previousTableInfo?.alias) {
              // console.log('inside if start');
              item.startTableName = newName;
              item.table1_uid = newName;
              updated = true;
            }
        
            if (item.endTableName === previousTableInfo?.alias) {
              // console.log('inside if end');
              item.endTableName = newName;
              item.table2_uid = newName;
              updated = true;
              // console.log('change update value');
            }
        
            if (updated) {
              updateRelationship(item.relationId, item); // Ensure this updates your global state immutably
            }
          });
        }
        setTempTables(newTempTables,'canvasTables line 309');
        setNewName("");
        setInputField(false);
      }
    } else {
      setOpenAlert(true);
      setseverity("error");
      setTestMessage("At least one letter should be provided");
      // Optionally, you can uncomment the setTimeout to hide the alert after some time
      // setTimeout(() => {
      //   setOpenAlert(false);
      //   setTestMessage("");
      // }, 4000);
    }
  };

  return (
    <div>
      <Draggable
        ref={dragRef}
        handle={`#${tableData.tableName}`}
        bounds="#canvasTableArea"
        position={{
          x: tableData.tablePositionX ? tableData.tablePositionX : x,
          y: tableData.tablePositionY ? tableData.tablePositionY : y,
        }}
        onStart={() => {
          setX(dragRef.current.state.x);
          setY(dragRef.current.state.y);
        }}
        onDrag={() => {
          updateXarrow();
          setX(dragRef.current.state.x);
          setY(dragRef.current.state.y);
        }}
        onStop={() => {
          const hasMoved = x !== dragRef.current.state.x || y !== dragRef.current.state.y;
          if(hasMoved){
            const newTable: tableObjProps[] = [...tempTable].map(
              (tab: tableObjProps) => {
                if (tab.table_uid === tableData.table_uid) {
                  tableData.tablePositionX = x;
                  tableData.tablePositionY = y;
                }
                return tab;
              }
            );
            setTempTables(newTable,'canvasTables line 350');
  
            updateXarrow();
          }
        }}
      >
        <div className="draggableBox" ref={dragRef} style={{maxWidth:'150px'}}>
          <div
            className="draggableBoxTitle"
            id={tableData.tableName}
            title={`${tableData.tableName} (${tableData.schema})`}
            onDoubleClick={() => {
              if(viewerRestriction)return;
              setInputField(true);
              setNewName(tableData.alias);
              selectText();
            }}
          >
            {inputField ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0px 5px 0px 5px",
                  width: "auto",
                }}
              >
                <TextField
                  autoFocus={true}
                  variant="standard"
                  id="name"
                  value={newName}
                  InputProps={{
                    style: {
                      fontSize: "12px",
                      color: "white",
                      borderBottom: "1px solid white",
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-root:before": {
                      display: "none",
                    },
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewName(e.target.value);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    columnGap: "5px",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button
                    sx={{
                      fontSize: "12px",
                      color: "white",
                      border: "1px solid white",
                      paddingBlock:'0.2rem'
                    }}
                    onClick={() => changeTableName(tableData.table_uid)}
                  >
                    OK
                  </Button>
                  <Button
                    sx={{
                      fontSize: "12px",
                      color: "white",
                      border: "1px solid white",
                      paddingBlock:'0.2rem'
                    }}
                    onClick={() => {
                      setInputField(false);
                      setNewName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex" ,paddingInline:'0.5rem',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                <p style={{ width:'90%',margin:0,fontSize:fontSize.medium}} className="ellipsis">{tableData.alias}</p>
                <div style={{ cursor: "pointer" }}>
                  <MoreVertIcon
                    style={{ float: "right" }}
                    onClick={(e) => {
                      setTableId(tableData.id);
                      setOpen(true);
                      setAnchorEl(e.currentTarget);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {tableData.columns.map((item: ColumnsWithUid, index: number) => {
            return (
              <CanvasTableColumns
                key={item.uid}
                dragRef={dragRef}
                columnName={item.columnName}
                itemType={item.dataType}
                itemId={item.uid}
                tableName={tableData.tableName}
                table_uid={tableData.table_uid}
                index={index}
                schema={tableData.schema}
                checkRelationExists={checkRelationExists}
                table_Id={tableData.id}
                disableDrag={viewerRestriction}
                tableHasCustomQuery={tableData.isCustomQuery}
              />
            );
          })}
        </div>
      </Draggable>
      <NotificationDialog
        onCloseAlert={() => {
          setOpenAlert(false);
          setTestMessage("");
        }}
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
      />

      <RelationshipDefiningComponent
        showRelationCard={showRelationCard}
        setShowRelationCard={setShowRelationCard}
        arrowProp={arrowProp}
        addRelationship={addRelationship}
      />
      <ActionPopover
        open={open}
        setOpen={setOpen}
        selectAction={selectAction}
        anchorEl={anchorEl}
        tableData={tableData}
        disabled={viewerRestriction}
      />
    </div>
  );
};

const mapStateToProps = (state: DataSetStateProps, ownProps: any) => {
  return {
    tempTable: state.dataSetState.tempTable,
    arrows: state.dataSetState.arrows,
    relationships: state.dataSetState.relationships,
    tables: state.dataSetState.tables,
    views: state.dataSetState.views,
    dsId: state.dataSetState.dsId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    addNewRelationship: (payload: RelationObjProps) =>
      dispatch(addNewRelationship(payload)),
    addArrows: (payload: any) => dispatch(addArrows(payload)),
    actionsOnRemoveTable: (
      tempTable: tableObjProps[],
      tables: UserTableProps[],
      tableId: string
    ) => dispatch(actionsOnRemoveTable(tempTable, tables, tableId)),
    setTempTables: (table: tableObjProps[],calledFrm?:string) => {
      dispatch(setTempTables(table));
    },
    updateRelationship: (relationId: any, relation: any) =>
      dispatch(updateRelationship(relationId, relation)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTables);
