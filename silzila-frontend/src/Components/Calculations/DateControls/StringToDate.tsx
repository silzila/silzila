import {
  Box,
  Container,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { connect } from "react-redux";
import { ICalculationSession } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import DateDropZone from "../DropZones/DateDropZone";
import TextField from "@mui/material/TextField";
import {
  addSource,
  deleteSourceV3,
  resetSource,
  setSource,
} from "../../../redux/Calculations/CalculationsActions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FormatBuilder from "./FormatBuilder";
import { fontSize } from "../../..";

interface IStringToDate {
  addSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex: number | undefined,
  ) => void;
  propKey: string;
  lengthOfSource: number;
  calculations: ICalculationSession;
  setSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex: number
  ) => void;
  resetSource: (propKey: string, flowId: string, subFlowId: number) => void;
  deleteSourceV3: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    sourceIndex: number
  ) => void;
}

const StringToDate = ({
  propKey,
  calculations,
  resetSource,
  setSource,
  addSource,
  deleteSourceV3,
}: IStringToDate) => {
  const currCalculation = calculations.properties[propKey];
  const valueTypes = useMemo(
    () => ["text", "decimal", "integer", "boolean", "date"],
    []
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const activeFlow = currCalculation.currentCalculationSession?.activeFlow!;
  const calculationInfo =
    currCalculation.currentCalculationSession?.calculationInfo!;
  const source = calculationInfo?.flows[activeFlow][0].source;
  const sourceType = calculationInfo?.flows[activeFlow][0]!.sourceType;
  const [name, setName] = useState<string>(source[0] || "");
  console.log(source, sourceType);
  const getName = (): string | null => {
    if (sourceType[0] === "field")
      return calculationInfo.fields[source[0]].displayName;
    return source[0];
  };
  const updateFormatValue = (
    idx: number | undefined,
    value: any,
    _delete: boolean = false
  ) => {
    if (_delete && idx)deleteSourceV3(propKey, activeFlow, 0, idx);
      

      else addSource(propKey, activeFlow, 0, value, "text", idx);
  };
  const getSeperator = (source: any): string[] => {
    const exclude = ["%Y", "%y", "%M", "%b", "%c", "%m", "%e", "%d", "%D"];
    return source.slice(1).filter((value: string) => !exclude.includes(value));
  };
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingLeft: "0.5rem",
        margin: 0,
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          padding: "0",
          margin: "0",
          fontWeight: "bold",
          // color: "gray",
          textAlign: "start",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            // color: "gray",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: fontSize.large,
            }}
          >
            String to Date
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            ({source && source[0] !== undefined && source[0] !== null ? 1 : 0}{" "}
            of 1/1)
          </Typography>
        </Box>
        <Tooltip title="Add Custom Date">
          <IconButton
            size="small"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          {valueTypes.map((type, index) => {
            return (
              <MenuItem
                key={index}
                sx={{ width: "7rem" }}
                disabled={type !== "text"}
                value={type}
                onClick={() => {
                  setAnchorEl(null);
                  addSource(propKey, activeFlow, 0, "", "text", 0);
                }}
              >
                {type.replace(/\b\w/g, (char) => char.toUpperCase())}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <DateDropZone propKey={propKey} flow="stringToDate">
        {source[0] === null || source[0] === undefined ? (
          <p style={{ fontSize: "11px", color: "#999999" }}>
            Drop a column or click + to add static values
          </p>
        ) : (
          <ListItem
            className="axisFilterField"
            sx={{
              borderRadius: "5px",
              marginBlock: "5px",
              marginLeft: "0.5rem",
              paddingLeft: "0.3rem",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "24px", // Match this height with TextField height if needed
              width: "95%",
              margin: "0",
              gap: "0.2rem",
              fontFamily: "Axiforma Black",
            }}
          >
            <button
              type="button"
              className="buttonCommon columnClose"
              onClick={() => {
                resetSource(propKey, activeFlow, 0);
                setName("");
              }}
              title="Remove field"
            >
              <CloseRoundedIcon style={{ fontSize: "13px" }} />
            </button>
            {sourceType[0] === "text" ? (
              <TextField
                id="outlined-number"
                onBlur={(e) => {
                  setSource(propKey, activeFlow, 0, e.target.value, "text", 0);
                }}
                onKeyDown={(e) => {
                  console.log(name)
                  if (e.key === "Enter") {
                    setSource(propKey, activeFlow, 0, name, "text", 0);
                  }
                }}
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                sx={{
                  width: "100%",
                  marginLeft: "0.5rem",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-root": {
                    height: "1.5rem",
                    fontSize: "11px",
                  },
                  "& .MuiTextField-root": {
                    outline: "none",
                    border: "none",
                  },
                  border: "none",
                  outline: "none",
                }}
              />
            ) : sourceType[0] === "field" ? (
              <ListItemText
                primary={getName()}
                sx={{ "& .MuiListItemText-primary": { fontSize: "11px" } }}
              />
            ) : null}
          </ListItem>
        )}
      </DateDropZone>
      {source[0] !== null && source[0] !== undefined && (
        <FormatBuilder
          updateFormatValue={updateFormatValue}
          yearFormat={source[1]}
          monthFormat={source[3]}
          dayFormat={source[5]}
          separator={getSeperator(source)}
          sources={source}
        />
      )}
    </Container>
  );
};
const mapStateToProps = (state: any) => {
  return {
    chartProp: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
    chartControls: state.chartControls,
    calculations: state.calculations,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    addSource: (
      propKey: string,
      flowId: string,
      subFlowId: number,
      source: any,
      sourceType: string,
      sourceIndex: number | undefined
    ) =>
      dispatch(
        addSource(propKey, flowId, subFlowId, source, sourceType, sourceIndex)
      ),
    setSource: (
      propKey: string,
      flowId: string,
      subFlowId: number,
      source: any,
      sourceType: string,
      sourceIndex: number
    ) =>
      dispatch(
        setSource(propKey, flowId, subFlowId, source, sourceType, sourceIndex)
      ),
    resetSource: (propKey: string, flowId: string, subFlowId: number) =>
      dispatch(resetSource(propKey, flowId, subFlowId)),
    deleteSourceV3: (
      propKey: string,
      flowId: string,
      subFlowId: number,
      sourceIndex: number
    ) => dispatch(deleteSourceV3(propKey, flowId, subFlowId, sourceIndex)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StringToDate);
