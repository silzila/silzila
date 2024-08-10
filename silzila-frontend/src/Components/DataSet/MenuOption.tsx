import React from "react";
import { Divider, Menu, MenuItem, Radio, Tooltip } from "@mui/material";

const MenuOption = ({ uid, open, anchorEl, onClose, filterFieldData }: any) => {
  const options = ["Include", "Exclude"];
  let options2 = ["Pick List", "Search Condition"];

  console.log(filterFieldData);

  if (
    filterFieldData.dataType === "timestamp" ||
    filterFieldData.dataType === "date"
  ) {
    options2 = ["Pick List", "Search Condition", "Relative Filter"];
  }

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={() => onClose("clickOutside")}
      MenuListProps={{ "aria-labelledby": "basic-button" }}
    >
      {options2.map((opt2, index) => (
        <div
          style={{ display: "flex" }}
          onClick={() => onClose("opt2", opt2, uid)}
          key={index}
        >
          <Tooltip
            title={opt2 === filterFieldData.fieldtypeoption ? "Selected" : null}
          >
            <Radio
              checked={opt2 === filterFieldData.fieldtypeoption}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: "12px",
                  height: "12px",
                  color: "#af99db",
                },
                alignSelf: "center",
                marginLeft: "5px",
              }}
            />
          </Tooltip>
          <MenuItem
            sx={{
              flex: 1,
              fontSize: "12px",
              alignSelf: "center",
              padding: "2px 0px",
              paddingRight: "1rem",
            }}
          >
            {opt2}
          </MenuItem>
        </div>
      ))}

      <Divider sx={{ margin: "5px 0px" }} />

      {options.map((opt, index) => (
        <div
          style={{ display: "flex" }}
          onClick={() => onClose("opt1", opt, uid)}
          key={index}
        >
          <Tooltip
            title={opt === filterFieldData.includeexclude ? "Selected" : null}
          >
            <Radio
              checked={opt === filterFieldData.includeexclude}
              disabled={
                opt === "Exclude" &&
                filterFieldData.fieldtypeoption === "Relative Filter"
              }
              sx={
                filterFieldData.includeexclude === "Exclude" &&
                opt === filterFieldData.includeexclude
                  ? {
                      "& .MuiSvgIcon-root": {
                        fontSize: "12px",
                        height: "12px",
                        color: "#ffb74d",
                      },
                      alignSelf: "center",
                      marginLeft: "5px",
                    }
                  : {
                      "& .MuiSvgIcon-root": {
                        fontSize: "12px",
                        height: "12px",
                        color: "#af99db",
                      },
                      alignSelf: "center",
                      marginLeft: "5px",
                    }
              }
            />
          </Tooltip>
          <MenuItem
            disabled={
              opt === "Exclude" &&
              filterFieldData.fieldtypeoption === "Relative Filter"
            }
            sx={{
              fontSize: "12px",
              alignSelf: "center",
              padding: "2px 0px",
              flex: 1,
            }}
          >
            {opt}
          </MenuItem>
        </div>
      ))}
    </Menu>
  );
};

export default MenuOption;
