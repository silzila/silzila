//this component is use for getting the result after the writing the custom query in textarea and after preview button
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
  removeRelationshipFromTableList,
} from "../../redux/DataSet/datasetActions";
import { setTempTables } from "../../redux/DataSet/datasetActions";
import { tableObjProps } from "../../redux/DataSet/DatasetStateInterfaces";
import { UserTableProps } from "../../redux/DataSet/DatasetStateInterfaces";
import { removeArrows } from "../../redux/DataSet/datasetActions";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

interface savedData {
  id: any;
  name: string;
  querydata: string;
}

export interface tableDataComponentProps {
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
  databaseName: string;
  deleteCustomQuery: any;
  RenameInputValueCustomQueryname: string;
  SelectQueryoption: Number;
  RenameToCanvasProps: string;
  setSelectQueryoption: React.Dispatch<React.SetStateAction<any>>;
  setRenameToCanvasProps: React.Dispatch<React.SetStateAction<string>>;
}

function CustomQueryResult({
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
  databaseName,
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

  const dispatch = useDispatch();
  const [savedData, setsavedData] = useState<savedData>({
    id: 0,
    name: "",
    querydata: "",
  });
  const [error, seterror] = useState<string>("");
  const [OpenAlert, setOpenAlert] = useState<boolean>(false);
  const [userTableArray, setUserTableArray] = useState<UserTableProps[]>([]);
  const [tempTableforCanvas, setTempTablesforCanvas] = useState<
    tableObjProps[]
  >([]);

  const tempTable = useSelector(
    (state: RootState) => state.dataSetState.tempTable
  ); //state from redux store
  //  const removeArrows=useSelector((state:RootState)=>state.dataSetState.)

  function AddUidInColumnData(data: any, name: string) {
    const updatedData = data.map((item: any, index: number = 1) => ({
      ...item,
      uid: name.concat(item.columnName),
    }));
    return updatedData;
  }

  //
  const OpentableColumnsCustomquery = async (data: any) => {
    try {
      const url = `metadata-columns-customquery/${connectionValue}`;
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
      const createResDatawithUId = AddUidInColumnData(res.data, data.name);
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
      console.log(tableData);
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
      const updatedtemptableforcanvas = tempTableforCanvas.filter(
        (item) => item.id !== deleteCustomQuery
      );
      const data = tempTableforCanvas.find(
        (item) => item.id === deleteCustomQuery
      );
      console.log(data);
      const DataforSetUserTabel: UserTableProps = {
        schema: data?.schema || "",
        databaseName: data?.databaseName || "",
        id: deleteCustomQuery,
        isNewTable: true,
        isSelected: false,
        tableName: data?.tableName || "",
        table_uid: data?.table_uid || "",
        isCustomQuery: true,
        customQuery: data?.customQuery || "",
      };

      setUserTableArray((prev: UserTableProps[]) => {
        const index = prev.findIndex(
          (item) => item.id === DataforSetUserTabel.id
        );
        if (index !== -1) {
          const updatedTable = [...prev];
          updatedTable[index] = DataforSetUserTabel;
          return updatedTable;
        } else {
          return [...prev, DataforSetUserTabel];
        }
      });
      // dispatch(setUserTable(userTableArray));
      setTempTablesforCanvas(updatedtemptableforcanvas); //remove the delete the temptable data from it and updated
      const updatedtemptable = tempTable.filter(
        (item: any) => item.id !== deleteCustomQuery
      );
      dispatch(setTempTables(updatedtemptable));

      // dispatch(setTempTables([...tempTable, ...tempTableforCanvas]));
      dispatch(removeArrows(deleteCustomQuery));
      dispatch(removeRelationshipFromTableList(deleteCustomQuery));
    }
  }, [deleteCustomQuery]);

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
          const updatedArray = prev.map((data) =>
            data.id === EditCustomQuery
              ? {
                  id: EditCustomQuery,
                  name: savedData.name,
                  querydata: CustomQueryData,
                }
              : data
          );

          OpentableColumnsCustomquery(
            updatedArray.find((data) => data.id === EditCustomQuery)
          );
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

  useEffect(() => {
    // Create a new array with updated values based on the comparison
    const isNamePresent = tempTable.find(
      (item: any) => item.alias === RenameToCanvasProps
    );

    if (isNamePresent) {
      seterror("Name is Already is present Please write different Name");
      setOpenAlert(true);
      setSelectQueryoption(0);
      setRenameToCanvasProps("");
      console.log("tgus");
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
          };
        }
        console.log(RenameToCanvasProps);
        // Return the original item if no match is found
        return item;
      });

      // Dispatch the updated tempTables array to the store
      dispatch(setTempTables(updatedTempTables));
    }
  }, [RenameToCanvasProps]);

  //update the value for Edit Custom Query
  useEffect(() => {
    const finddata = CustomQuerysArray.find(
      (item) => item.id === EditCustomQuery
    );
    // const isNamePresent = tempTable.map(
    //   (item: any) => item.alias === finddata?.name
    // );
    // if (isNamePresent && EditCustomQuery !== 0) {
    //   seterror("please write different name it is ssssalready present");
    //   setOpenAlert(true);
    //   return;
    // }
    if (finddata) {
      setsavedData((prevState) => ({
        ...prevState,
        name: finddata.name,
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
                "& .MuiTextField-root": { margin: 1, width: "20px" },
              }}
            >
              <TextField
                sx={{
                  flex: 1,
                  margin: "auto 20px",
                  maxWidth: "200px",
                  // outlineColor: "#af99db",
                }}
                inputProps={{
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
                value={savedData.name}
                color="secondary"
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
                color: "#00A4B4",
                outlineColor: "#00A4B4",
                outline: "1px solid #00A4B4",
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
