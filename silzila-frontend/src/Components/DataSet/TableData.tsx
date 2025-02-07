// Sample records of selected table shown in Create / Edit dataset page

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import "./Dataset.css";
import { set } from "lodash";

export interface tableDataComponentProps {
  showDialogBox: boolean;
  isLoading: boolean;
  setShowDialogBox: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTable: string;
  setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
  tableData: any[];
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  objKeys: any[];
  setShowEyeIcon?: React.Dispatch<React.SetStateAction<boolean>>;
}

function TableData({
  showDialogBox,
  isLoading,
  setShowDialogBox,
  selectedTable,
  setSelectedTable,
  tableData,
  setTableData,
  objKeys,
  setShowEyeIcon,
}: tableDataComponentProps) {
  const handleClose = () => {
    setShowDialogBox(false);
    setSelectedTable("");
    setTableData([]);
	setShowEyeIcon && setShowEyeIcon(false);
  };
  return (
    <>
      <Dialog
        open={showDialogBox}
        maxWidth="xl"
        fullWidth={true}
        PaperProps={{
          sx: {
            minHeight: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            columnGap: "2rem",
            justifyContent: "space-between",
            fontSize: "16px",
			alignItems: "center",
          }}
        >
          <p >{selectedTable}</p>
          <p>Rows Displayed: {tableData.length}</p>
          <CloseOutlined onClick={handleClose} style={{ marginTop:'-7px' }} />
        </DialogTitle>
        <DialogContent
          sx={{
            maxWidth: isLoading ? "100%" : "fit-content",
			"::-webkit-scrollbar": {
					width: "5px",
					height: "5px"
				},
          }}
        >
          {isLoading ? (
            <div
              className="loading-container"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div className="user-spinner"></div>
            </div>
          ) : (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
export default TableData;
