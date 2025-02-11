import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { makeStyles } from "@mui/styles";
import { fontSize, palette } from "../..";

const dropDownStyles = makeStyles({
  customSelect: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#2bb9bb",
      },
      "&:hover fieldset": {
        borderColor: "#2bb9bb", 
      }
    },
  },
});

const DropDownForPattern = ({
  items,
  exprType = "exprType",
  value,
  handleDropDownChange,
  usersx,
}: {
  items: any;
  exprType: string;
  value: any;
  handleDropDownChange: (e: any, key: string) => void;
  usersx?: any
}) => {
  return (
    <FormControl
      fullWidth
      size="small"
      className={dropDownStyles().customSelect}
      // sx={{ margin: "4px" }}
    >
      <Select
        sx={{
          height: "1.5rem",
          fontSize: fontSize.large,
          textAlign: "left",
          ".MuiSelect-icon": {
            fontSize: fontSize.TripleExtraLarge,
            marginLeft: "20px",
            marginRight: "0.5rem",
            color: palette.primary.contrastText,
            right: "3.5px",
            ...usersx
          },
        }}
        IconComponent={KeyboardArrowDownIcon}
        onChange={(e) => {
          handleDropDownChange(e, exprType);
        }}
        value={value}
      >
        {items.map((item: any) => {
          return (
            <MenuItem key={item.key} value={item.key}>
              
              <Typography
                component="div"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "12px auto", // Fixed width for icon, auto for text
                  alignItems: "center",
                  fontSize: fontSize.medium,
                  whiteSpace: "nowrap",

                }}
              >
                <span style={{fontSize: fontSize.medium, }}>
                  {item.value.split(" ")[0]} 
                </span >
                <span style={{fontSize: fontSize.medium, }}>{item.value.split(" ").slice(1).join(" ")}</span>{" "}
                {/* Remaining text */}
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default DropDownForPattern;
