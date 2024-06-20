// this components is use for display customquery result and take custom query name
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

interface savedData {
  id: number;
  name: string;
  querydata: string;
}

export interface tableDataComponentProps {
  showTableData: boolean;
  setShowTableData: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTable: string;
  setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
  tableData: any[];
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  objKeys: any[];
  setCustomQuerysArray: React.Dispatch<React.SetStateAction<savedData[]>>;
  CustomQuerysArray: savedData[];
  CustomQueryData: string;
  setCustomQuery: React.Dispatch<React.SetStateAction<boolean>>;
  EditCustomQuery: any;
  setEditCustomQuery: React.Dispatch<React.SetStateAction<any>>;
}

function CustomQueryResult({
  showTableData,
  setShowTableData,
  selectedTable,
  setSelectedTable,
  tableData,
  setTableData,
  objKeys,
  setCustomQuerysArray,
  CustomQuerysArray,
  CustomQueryData,
  setCustomQuery,
  EditCustomQuery,
  setEditCustomQuery,
}: tableDataComponentProps) {
  const handleClose = () => {
    setShowTableData(false);
    setSelectedTable("");
    setTableData([]);
  };

  const [savedData, setsavedData] = useState<savedData>({
    id: 0,
    name: "",
    querydata: "",
  });
  const [error, seterror] = useState<string>("");
  const [OpenAlert, setOpenAlert] = useState<boolean>(false);

  useEffect(() => {
    if (EditCustomQuery !== 0) {
      const data = CustomQuerysArray.find(
        (item) => item.id === EditCustomQuery
      );
      if (data) {
        setsavedData({
          id: EditCustomQuery,
          name: data.name,
          querydata: data.querydata,
        });
      }
    }
  }, [EditCustomQuery, CustomQuerysArray]);

  const handleSavedData = () => {
    if (savedData.name.length > 0) {
      setCustomQuerysArray((prev) => {
        const exists = prev.find(
          (data) => data.name === savedData.name && data.id !== savedData.id
        );
        if (!exists) {
          if (EditCustomQuery !== 0) {
            const updatedArray = prev.map((data) =>
              data.id === EditCustomQuery
                ? { ...data, name: savedData.name, querydata: CustomQueryData }
                : data
            );
            setEditCustomQuery(0);
            setsavedData({ id: 0, name: "", querydata: "" });
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
            setsavedData({ id: 0, name: "", querydata: "" });
            handleClose();
            setCustomQuery(false);
            return [...prev, newdata];
          }
        } else {
          setOpenAlert(true);
          seterror(
            "A query with that name already exists. Please use a different name."
          );
          return prev;
        }
      });
    } else {
      seterror("Please provide a name for the query.");
      setOpenAlert(true);
    }
  };

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
                    outlineColor: "green",
                  },
                }}
                onChange={(e) =>
                  setsavedData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                id="outlined-size-small"
                size="small"
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
                color: "black",
                outlineColor: "green",
                outline: "1px solid green",
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
