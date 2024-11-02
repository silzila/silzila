import React from "react";
import { Divider, Menu, MenuItem, Radio, Tooltip } from "@mui/material";

const MenuOption = ({ uid, open, anchorEl, onClose, filterFieldData }: any) => {
  function toCamelCase(str:string) {
    return str
      .toLowerCase()
      .split(/[\s-_]+/) // Split the string by spaces, dashes, or underscores
      .map((word:string, index:number) => {
        if (index === 0) {
          return word; // Leave the first word in lowercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of the rest
      })
      .join(''); // Join the words back into a single string
  }  
  const options = ["Include", "Exclude"];
  let options2 = ["Pick List", "Search Condition"];

  if (
    filterFieldData.current.dataType === "timestamp" ||
    filterFieldData.current.dataType === "date"
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
          onClick={() => onClose("opt2", toCamelCase(opt2), uid)}
          key={index}
        >
          <Tooltip
            title={toCamelCase(opt2) === filterFieldData.current.filterType ? "Selected" : null}
          >
            <Radio
              checked={toCamelCase(opt2) === filterFieldData.current.filterType}
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
            title={(opt==="Exclude" &&filterFieldData.current.shouldExclude) ||(opt==="Include" &&!filterFieldData.current.shouldExclude) ? "Selected" : null}
          >
            <Radio
              checked={(opt==="Exclude" &&filterFieldData.current.shouldExclude) ||(opt==="Include" &&!filterFieldData.current.shouldExclude) }
              disabled={
                opt === "Exclude" &&
                filterFieldData.current.filterType === "Relative Filter"
              }
              sx={
                filterFieldData.current.shouldExclude &&
                opt === "Exclude"
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
              filterFieldData.current.filterType === "Relative Filter"
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
