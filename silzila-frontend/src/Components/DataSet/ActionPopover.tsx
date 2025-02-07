// This component is part of Table header in dataset create / edit page
// Allows to
// 	- remove table from canvas
// 	- rename table

import { Button, Popover } from "@mui/material";
import React from "react";
import { tableObjProps } from "../../redux/DataSet/DatasetStateInterfaces";
import data from "../DataSet/Data.json";

interface ActionPopoverProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: any;
  selectAction: (e: any) => void;
  tableData: tableObjProps;
  disabled?: boolean;
}

const ActionPopover = (props: ActionPopoverProps) => {
  const { open, setOpen, anchorEl, selectAction, tableData } = props;
  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => setOpen(false)}
      >
        <div style={{ padding: "0 0", fontSize: "14px", minWidth: "5rem" }}>
          {tableData.isNewTable ? (
            <React.Fragment>
              {data.actions.map((act: any, i: number) => {
                return (
                  <div key={i}>
                    <Button
                    disabled={props.disabled}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "transparent",
                        cursor: props.disabled?'not-allowed':"pointer",
                        color: "black",
                        fontSize: "13px",
                        width: "100%",
                        borderRadius: "0",

                        "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                      }}
                      size="small"
                      onClick={selectAction}
                      id={act.id}
                    >
                      {act.actionName}
                    </Button>
                  </div>
                );
              })}
            </React.Fragment>
          ) : (
            <div key={"3"}>
              <Button
              disabled={props.disabled}
                onClick={selectAction}
                id={"2"}
                sx={{
                  textTransform: "none",
                  backgroundColor: "transparent",
                  cursor: props.disabled?'not-allowed':"pointer",
                  color: "black",
                  fontSize: "13px",
                  width: "100%",
                  borderRadius: "0",

                  "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                }}
              >
                {"Rename"}
              </Button>
            </div>
          )}
        </div>
      </Popover>
    </>
  );
};
export default ActionPopover;
