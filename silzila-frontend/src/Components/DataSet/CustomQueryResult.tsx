//this component is use for getting the result after the writing the custom query after clicking the Add Buttom and after preview button
// get the result of custom query and tables, data related to custom query
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import "./Dataset.css";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import ShortUniqueId from "short-unique-id";
import FetchData from "../ServerCall/FetchData";
import { useDispatch } from "react-redux";
import {
  addTable,
  removeArrowsFromcanvas,
  removeRelationshipFromCanvas,
  removeRelationshipFromTableList,
  setRelationship,
  updateRelationship,
} from "../../redux/DataSet/datasetActions";
import { setTempTables } from "../../redux/DataSet/datasetActions";
import { tableObjProps } from "../../redux/DataSet/DatasetStateInterfaces";
import { removeArrows } from "../../redux/DataSet/datasetActions";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { RelationObjProps } from "./CanvasTablesIntefaces";
import { useLocation, useNavigate } from "react-router-dom";


interface savedData {
  id: any;
  name: string;
  querydata: string;
}

export interface tableDataComponentProps {
  editMode?: boolean;
  showTableData: boolean;
  setShowTableData: React.Dispatch<React.SetStateAction<boolean>>;
  tableData: any[];
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  objKeys: any[];
  setCustomQuerysArray: React.Dispatch<React.SetStateAction<savedData[]>>;
  CustomQuerysArray: savedData[];
  CustomQueryData: string;
  setCustomQuery: React.Dispatch<React.SetStateAction<boolean>>;
  EditCustomQuery: any;
  setEditCustomQuery: React.Dispatch<React.SetStateAction<any>>;
  connectionValue: string;
  token: string;
  deleteCustomQuery: any;
  RenameInputValueCustomQueryname: string;
  SelectQueryoption: Number;
  RenameToCanvasProps: string;
  setSelectQueryoption: React.Dispatch<React.SetStateAction<any>>;
  setRenameToCanvasProps: React.Dispatch<React.SetStateAction<string>>;
}

function CustomQueryResult({
  editMode,
  showTableData,
  setShowTableData,
  tableData,
  setTableData,
  objKeys,
  setCustomQuerysArray,
  CustomQuerysArray,
  CustomQueryData,
  setCustomQuery,
  EditCustomQuery,
  setEditCustomQuery,
  connectionValue,
  token,
  deleteCustomQuery,
  RenameInputValueCustomQueryname,
  SelectQueryoption,
  RenameToCanvasProps,
  setSelectQueryoption,
  setRenameToCanvasProps,
}: tableDataComponentProps) {
  const handleClose = () => {
    setShowTableData(false);
    setTableData([]);
  };

  const location = useLocation();
  const state	= location.state;
  const navigate = useNavigate();
  

  const dispatch = useDispatch();
  const [savedData, setsavedData] = useState<savedData>({
    id: 0,
    name: "",
    querydata: "",
  });
  const [error, seterror] = useState<string>("");
  const [OpenAlert, setOpenAlert] = useState<boolean>(false);
  const [tempTableforCanvas, setTempTablesforCanvas] = useState<
    tableObjProps[]
  >([]);

  const tempTable = useSelector(
    (state: RootState) => state.dataSetState.tempTable
  ); //state from redux store
  const relationshipsArray = useSelector(
    (state: RootState) => state.dataSetState.relationships
  );
  const arrows = useSelector((state: RootState) => state.dataSetState.arrows);
  //  const removeArrows=useSelector((state:RootState)=>state.dataSetState.)

  function AddUidInColumnData(data: any, name: string) {
    const updatedData = data.map((item: any, index: number = 1) => ({
      ...item,
      uid: name.concat(item.columnName),
    }));
    return updatedData;
  }

  useEffect(() => {
    if(!state){
      navigate("/")
    }
  }, [state, navigate])

  //add columns into canvas by fetching the query from server
  const OpentableColumnsCustomquery = async (data: any) => {
    try {
      const url = `metadata-columns-customquery/${connectionValue}?workspaceId=${state?.parentId}`;
      const res: any = await FetchData({
        requestType: "withData",
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data.querydata,
      });
      const createResDatawithUId = AddUidInColumnData(res.data, data.id);
      const tableData = {
        id: data.id,
        alias: data.name,
        columns: createResDatawithUId,
        databaseName: "",
        dcId: connectionValue,
        isNewTable: true,
        isSelected: true,
        schema: "",
        tableName: data.name,
        tablePositionX: 0,
        tablePositionY: 0,
        table_uid: data.name,
        isCustomQuery: true,
        customQuery: data.querydata,
      };
      let updatedTempTables: any;

      if (EditCustomQuery !== 0) {
        const isNamePresent = tempTable.find(
          (item: any) => item.alias === data.name && item.id !== EditCustomQuery
        );
        if (isNamePresent) {
          seterror("Name is Already is present Please write different Name");
          setOpenAlert(true);
          setSelectQueryoption(0);
          return;
        } else {
          updatedTempTables = tempTable.map((item: any) =>
            item.id === EditCustomQuery && item.dcId === connectionValue
              ? tableData
              : item
          );
          setTempTablesforCanvas(updatedTempTables);
          dispatch(setTempTables([...updatedTempTables]));
          setEditCustomQuery(0);
          return;
        }
      } else {
        updatedTempTables = [...tempTableforCanvas, tableData];
      }

      setTempTablesforCanvas(updatedTempTables);

      dispatch(addTable(tableData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (deleteCustomQuery !== 0) {
      //remove the data custom query from canvas table

      setCustomQuerysArray(
        CustomQuerysArray.filter((item) => item.id !== deleteCustomQuery)
      );
      // remove arrow
      dispatch(removeArrows(deleteCustomQuery));
      //remove the delete the temptable data from it and updated
      const updatedtemptable = tempTable.filter(
        (item: any) => item.id !== deleteCustomQuery
      );
      dispatch(setTempTables(updatedtemptable));
      //if is there any relationship between delete query and other tables find and delete
      const deleteRelationId = relationshipsArray.filter(
        (item: RelationObjProps) => {
          if (
            item.startId === deleteCustomQuery ||
            item.endId === deleteCustomQuery
          ) {
            return item;
          } else {
            return null;
          }
        }
      );
      //delete relation for deleteQuery
      if (deleteRelationId) {
        deleteRelationId.map((item: RelationObjProps) => {
          dispatch(removeArrowsFromcanvas(item.relationId));
          dispatch(removeRelationshipFromCanvas(item.relationId));
          dispatch(removeRelationshipFromTableList(item.relationId));
        });
      }
    }
  }, [deleteCustomQuery]);

  //save data
  const handleSavedData = () => {
    if (savedData.name.length > 0) {
      setCustomQuerysArray((prev) => {
        // Check for duplicate data
        if (EditCustomQuery !== 0) {
          //check for duplicate or not exept self
          const exists = prev.find(
            (data) =>
              data.name === savedData.name && data.id !== EditCustomQuery
          );
          const isNamePresent = tempTable.find(
            (item: any) =>
              item.id !== EditCustomQuery && item.alias === savedData.name
          );
          if (exists || isNamePresent) {
            setOpenAlert(true);
            seterror(
              "A query with that name already exists. Please use a different name."
            );
            // setEditCustomQuery(0);
            return prev;
          }
          var CheckpreviousQueryName: string = "";
          const previousQueryDataFordeleteRelation: any = prev.find(
            (item: any) => {
              if (item.id === EditCustomQuery) {
                CheckpreviousQueryName = item.name;
                return item.querydata;
              }
              return "";
            }
          );
          const updatedArray = prev.map((data) =>
            data.id === EditCustomQuery
              ? {
                  id: EditCustomQuery,
                  name: savedData.name,
                  querydata: CustomQueryData,
                }
              : data
          );

          const findRelationId = relationshipsArray.find((item: any) => {
            if (
              item.startId === EditCustomQuery ||
              item.endId === EditCustomQuery
            ) {
              return item;
            } else {
              return null;
            }
          });
          if (!editMode && findRelationId) {
            dispatch(
              removeRelationshipFromTableList(findRelationId.relationId)
            );
            dispatch(removeRelationshipFromCanvas(findRelationId.relationId));
            dispatch(removeArrowsFromcanvas(findRelationId.relationId));
            dispatch(removeArrows(EditCustomQuery));
            OpentableColumnsCustomquery(
              updatedArray.find((data) => data.id === EditCustomQuery)
            );
          } else if (!editMode) {
            OpentableColumnsCustomquery(
              updatedArray.find((data) => data.id === EditCustomQuery)
            );
          }
          if (
            editMode &&
            previousQueryDataFordeleteRelation.querydata !== CustomQueryData
          ) {
            if (findRelationId) {
              dispatch(
                removeRelationshipFromTableList(findRelationId.relationId)
              );
              dispatch(removeRelationshipFromCanvas(findRelationId.relationId));
              dispatch(removeArrowsFromcanvas(findRelationId.relationId));
              dispatch(removeArrows(EditCustomQuery));
            }
            OpentableColumnsCustomquery(
              updatedArray.find((data) => data.id === EditCustomQuery)
            );
          } else {
          }

          setEditCustomQuery(0);
          setsavedData({ id: 0, name: "", querydata: "" });
          handleClose();
          setCustomQuery(false);

          return updatedArray;
        } else {
          // Check for duplicate name when adding a new query
          const exists = prev.find(
            (data) => data.name === savedData.name && data.id !== savedData.id
          );
          const exitsInTempTable = tempTable.find(
            (item: any) => item.alias === savedData.name
          );

          if (exists || exitsInTempTable) {
            // Duplicate name of custom query
            setOpenAlert(true);
            seterror(
              "A query with that name already exists. Please use a different name."
            );
            return prev;
          } else {
            const uid: any = new ShortUniqueId({ length: 8 });
            const newdata = {
              ...savedData,
              id: uid(),
              querydata: CustomQueryData,
            };
            OpentableColumnsCustomquery(newdata);
            setsavedData({ id: 0, name: "", querydata: "" });
            handleClose();
            setCustomQuery(false);
            return [...prev, newdata];
          }
        }
      });
    } else {
      seterror("Please provide a name for the query.");
      setOpenAlert(true);
    }
  };
  //changes in temptable then reflect it into the custom Query Array in sidebar
  useEffect(() => {
    const updatedCustomQueryArray = CustomQuerysArray.filter((item) =>
      tempTable.some((tempItem: any) => tempItem.id === item.id)
    ).map((item) => {
      const found = tempTable.find((tempItem: any) => tempItem.id === item.id);

      // Check if the name is a duplicate in tempTable
      const isDuplicateName = tempTable.some(
        (tempItem: any) =>
          tempItem.alias === found.alias && tempItem.id !== found.id
      );

      return found && !isDuplicateName ? { ...item, name: found.alias } : item;
    });

    setCustomQuerysArray(updatedCustomQueryArray);
  }, [tempTable]);

  //update the values in relationship and temptable on Rename Custom Query
  useEffect(() => {
    // Create a new array with updated values based on the comparison
    const isNamePresent = tempTable.find(
      (item: any) => item.alias === RenameToCanvasProps
    );

    // Find previous name
    const previousName = CustomQuerysArray.find(
      (item: any) => item.id === SelectQueryoption
    );

    const findRelationId = arrows.filter((item: any) => {
      if (
        item.startId === previousName?.id ||
        item.endId === previousName?.id
      ) {
        return item;
      } else {
        return null;
      }
    });

    if (isNamePresent) {
      seterror("Name is already present. Please write a different name.");
      setOpenAlert(true);
      setSelectQueryoption(0);
      setRenameToCanvasProps("");
      return;
    } else {
      const updatedTempTables = tempTable.map((item: any) => {
        // Find the corresponding item in the CustomQuerysArray
        const found = CustomQuerysArray.find(
          (tempItem: any) => tempItem.id === item.id // Compare the ids
        );

        // If an item is found and SelectQueryoption matches the current item id
        if (found && found.id === SelectQueryoption && !isNamePresent) {
          return {
            ...item,
            alias: RenameToCanvasProps,
            tableName: RenameToCanvasProps,
            table_uid: RenameToCanvasProps,
          };
        }
        if (findRelationId.length > 0 && !isNamePresent) {
          // Update name in relationship arrow

          findRelationId.forEach((item: any) => {
            let updated = false;

            if (item.startTableName === RenameInputValueCustomQueryname) {
              item.startTableName = RenameToCanvasProps;
              updated = true;
            }

            if (item.endTableName === RenameInputValueCustomQueryname) {
              item.endTableName = RenameToCanvasProps;
              updated = true;
            }

            if (updated) {
              dispatch(updateRelationship(item.relationId, item));
            }
          });
        }
        // Return the original item if no match is found
        return item;
      });
      // Dispatch the updated tempTables array to the store
      dispatch(setTempTables(updatedTempTables));
      setSelectQueryoption(0);
    }
  }, [RenameToCanvasProps]);

  useEffect(() => {
    const finddata = CustomQuerysArray.find(
      (item) => item.id === EditCustomQuery
    );

    if (finddata) {
      setsavedData((prevState) => ({
        ...prevState,
        name: finddata.name,
        querydata: finddata.querydata,
      }));
    }
  }, [EditCustomQuery]);

  return (
    <>
      <Dialog
        open={showTableData}
        maxWidth="xl"
        fullWidth={true}
        PaperProps={{
          sx: {
            minHeight: "90%",
          },
        }}
      >
        <DialogContent
          sx={{
            maxWidth: "fit-content",
            paddingTop: "0px",
            marginTop: "1%",
          }}
        >
          <Table stickyHeader padding="normal">
            <TableHead>
              <TableRow>
                {objKeys &&
                  objKeys.map((el: string, i: number) => {
                    return (
                      <TableCell
                        style={{
                          fontWeight: "bold",

                          backgroundColor: "#e8eaf6",
                        }}
                        key={i}
                      >
                        {el}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody style={{ width: "auto", paddingTop: "200px" }}>
              {tableData.map((data: any, i: number) => {
                return (
                  <TableRow key={i} id="TRow">
                    {objKeys.map((obj: string) => {
                      return (
                        <TableCell key={obj} id="TColumn">
                          {data[obj]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "2%",
          }}
        >
          <div>
            <Button
              variant="contained"
              onClick={handleClose}
              id="cancelButton"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Tooltip
              title="Click to Edit"
              sx={{
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <TextField
                sx={{
                  flex: 1,
                  margin: "auto 20px",
                  maxWidth: "200px",
                  "& label": { fontSize: "14px", color: "#af99db" },
                  "& .MuiOutlinedInput-root": { borderRadius: 1 },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#af99db",
                  },
                }}
                InputProps={{
                  style: {
                    fontSize: "14px",
                  },
                }}
                onChange={(e) =>
                  setsavedData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    querydata: CustomQueryData,
                  }))
                }
                id="outlined-size-small"
                size="small"
                color="secondary"
                value={savedData.name}
                label="Name Custom Query"
              />
            </Tooltip>

            <Button
              variant="contained"
              onClick={handleSavedData}
              id="setButton"
              sx={{ textTransform: "none" }}
              style={{
                backgroundColor: "white",
                color: "#2bb9bb",
                outlineColor: "#2bb9bb",
                outline: "1px solid #2bb9bb",
                border: "none",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </Dialog>
      {error.length > 0 ? (
        <NotificationDialog
          onCloseAlert={() => {
            setOpenAlert(false);
            seterror("");
          }}
          severity={"error"}
          testMessage={error}
          openAlert={OpenAlert}
        />
      ) : null}
    </>
  );
}

export default CustomQueryResult;
