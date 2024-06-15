// Sample records of selected table shown in Create / Edit dataset page

import React, { useState } from "react";
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

interface savedData {
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
  setCustomQuerySavedData: React.Dispatch<React.SetStateAction<savedData[]>>;
  CustomQuerySavedData: savedData[];
  CustomQueryData: string;
}

function CustomQueryResult({
  showTableData,
  setShowTableData,
  selectedTable,
  setSelectedTable,
  tableData,
  setTableData,
  objKeys,
  setCustomQuerySavedData,
  CustomQuerySavedData,
  CustomQueryData,
}: tableDataComponentProps) {
  const handleClose = () => {
    setShowTableData(false);
    setSelectedTable("");
    setTableData([]);
  };
  const [savedData, setsavedData] = useState<savedData>({
    name: "",
    querydata: "",
  });
  const handleSavedData = () => {
    if (savedData) {
      setCustomQuerySavedData((prev) => {
        const exists = prev.find((data) => data.name === savedData.name);
        if (!exists) {
          return [...prev, savedData];
        }
        return prev;
      });
      setsavedData({ name: "", querydata: "" });
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
                      return <TableCell id="TColumn">{data[obj]}</TableCell>;
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
                    color: "#3B3C36",
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
                label="Name Table Data"
              />
            </Tooltip>
            <Button
              variant="contained"
              onClick={handleSavedData}
              id="setButton"
              sx={{ textTransform: "none" }}
            >
              Ok
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default CustomQueryResult;
