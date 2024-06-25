//this component is use for getting the result after the writing the custom query in textarea and after preview button
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
      const tableData = {
        id: data.id,
        alias: data.name,
        columns: res.data,
        databaseName: databaseName,
        dcId: connectionValue,
        isNewTable: true,
        isSelected: true,
        schema: "",
        tableName: data.name,
        tablePositionX: 0,
        tablePositionY: 0,
        table_uid: data.name,
      };

      let updatedTempTables: any;

      if (EditCustomQuery !== 0) {
        updatedTempTables = tempTable.map((item: any) =>
          item.id === EditCustomQuery && item.dcId === connectionValue
            ? tableData
            : item
        );

        setTempTablesforCanvas(updatedTempTables);
        dispatch(setTempTables([...updatedTempTables]));
        setEditCustomQuery(0);
        return;
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
      const DataforSetUserTabel: UserTableProps = {
        schema: data?.schema || "",
        databaseName: data?.databaseName || "",
        id: deleteCustomQuery,
        isNewTable: true,
        isSelected: false,
        tableName: data?.tableName || "",
        table_uid: data?.table_uid || "",
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
        //check for duplicate data
        const exists = prev.find(
          (data) => data.name === savedData.name && data.id !== savedData.id
        );
        if (exists) {
          //duplicate name of custom query
          setOpenAlert(true);
          seterror(
            "A query with that name already exists. Please use a different name."
          );
          return prev;
        } else {
          //for edit the query by click on edit on threedot
          if (EditCustomQuery !== 0) {
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
            // setsavedData({ id: 0, name: "", querydata: "" });
            handleClose();
            setCustomQuery(false);
            return updatedArray;
          } else {
            const uid: any = new ShortUniqueId({ length: 8 });
            const newdata: savedData = {
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

  // useEffect(() => {
  //   const updatedTable = tempTable.map((item: any) => {
  //     const match = CustomQuerysArray.find(
  //       (anotherItem: any) => anotherItem.id === item.id
  //     );
  //     if (match) {
  //       return { match }; // Update value if there's a match
  //     }
  //     return {}; // Return original item if no match
  //   });

  //   // dispatch(setTempTables(updatedTable));
  //   setCustomQuerysArray(updatedTable); // Update the state with the updated array
  // }, [tempTable]);

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
          }}
        >
          <Table stickyHeader>
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
            <TableBody style={{ width: "auto" }}>
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
                }}
                inputProps={{
                  style: {
                    fontSize: "14px",
                    outlineColor: "purple",
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
                color="primary"
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
