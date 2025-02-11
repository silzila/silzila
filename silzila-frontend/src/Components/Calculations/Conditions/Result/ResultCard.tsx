import { connect } from "react-redux";
import { ICalculationSession } from "../../../../redux/Calculations/CurrentCalculationSessionInterface";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  alpha,
  ListItem,
  styled,
  Switch,
  Box,
  TextField,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import {
  addResultForIfElse,
  deleteResult,
} from "../../../../redux/Calculations/CalculationsActions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns";
import { useState } from "react";
import { fontSize, palette } from "../../../..";
interface IResultCard {
  sourceId: string;
  propKey: string;
  sourceType: string;

  calculations: ICalculationSession;
  deleteResult: (
    propKey: string,
    flowId: string,
    conditionIndex: number
  ) => void;
  addResultForIfElse: (
    propKey: string,
    flowId: string,
    conditionIndex: number,
    sourceId: string,
    sourceType: string
  ) => void;
}
const ResultCard = ({
  sourceId,
  sourceType,
  propKey,
  calculations,
  deleteResult,
  addResultForIfElse,
}: IResultCard) => {
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;

  const activeCondition = currentCalculationSession?.activeCondition;
  const activeFlow = currentCalculationSession?.activeFlow;
  const getName = (): string | null => {
    if (
      !currentCalculationSession ||
      !currentCalculationSession.calculationInfo
    )
      return null;
    if (sourceType === "field")
      return currentCalculationSession.calculationInfo.fields[sourceId]
        .displayName;
    return sourceId;
  };
  const [name, setName] = useState<string>(sourceId);
  const TillDateSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-thumb": {
      width: 20,
      height: 20,
      minWidth: 20, // Ensures the thumb remains circular
      minHeight: 20, // Ensures the thumb remains circular
      borderRadius: "50%",
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#2bb9bb",
      "&:hover": {
        backgroundColor: alpha("#2bb9bb", theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#2",
    },
  }));

  const TrueFalse = () => {
    return (
      <FormGroup
        sx={{
          marginLeft: "6px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            justifyContent: "flex-start",
            gap: "0.5rem",
          }}
        >
          <Typography>False</Typography>
          <FormControlLabel
            value="end"
            control={
              <TillDateSwitch
                checked={sourceId.toLowerCase() === "true"}
                onChange={(e) => {
                  addResultForIfElse(
                    propKey,
                    activeFlow!,
                    activeCondition!,
                    e.target.checked ? "true" : "false",
                    sourceType
                  );
                }}
              />
            }
            label={<Typography>True</Typography>}
            labelPlacement="end"
          />
        </Box>
      </FormGroup>
    );
  };

  return (
    <ListItem
      sx={{
        border: "1px solid grey",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "1.5rem",
        width: "100%",
        gap: "0.5rem",
        paddingInline: '0.2rem',
        "&.axisFilterField": {
          width: "inherit",
        },
      }}
      className="axisFilterField"
    >
      {/* <button
        type="button"
        className="buttonCommon columnClose"
        onClick={() => {
          deleteResult(propKey, activeFlow!, activeCondition!);
        }}
        title="Remove field"
      > */}
      <CloseRoundedIcon
        onClick={() => {
          deleteResult(propKey, activeFlow!, activeCondition!);
        }}
        sx={{
          fontSize: fontSize.medium,
          cursor: "pointer",
          color: palette.primary.contrastText,
          "&:hover": {
            color: "red",
            transform: "scale(1.1)",
          },
        }}
      />
      {/* </button> */}

      {sourceType === "field" ? (
        <span style={{ lineHeight: "15px", fontSize: fontSize.medium, color: palette.primary.contrastText }}>{getName()}</span>
      ) : sourceType === "date" ? (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            format="yyyy-MM-dd"
            value={parseISO(sourceId || new Date().toISOString().split("T")[0])}
            onChange={(newValue) => {
              if (!newValue) return;
              addResultForIfElse(
                propKey,
                activeFlow!,
                activeCondition!,
                newValue.toISOString().split("T")[0],
                sourceType
              );
            }}
            sx={{ outline: "none", border: "none" }}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      height: "1rem", // Set a fixed height to match ListItem
                      fontSize: "0.8rem", // Adjust font size if needed
                      outline: "none",
                      border: "none",
                    },
                  }}
                  className="customDatePickerHeight"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove border from the notched outline
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensure no border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensure no border when focused
                    },
                  }}
                />
              ),
            }}
          />
        </LocalizationProvider>
      ) : sourceType === "boolean" ? (
        <TrueFalse />
      ) : (
        <Box display="flex" flex="1" alignItems="center">
          <input
            autoFocus
            style={{
              height: "1rem", // Adjust height to match ListItem
              fontSize: "0.8rem", // Optional: adjust font size
              outline: "none",
              border: "none",
              paddingRight: "0.65rem"
              // borderBottom: "1px solid ",
            }}
            className="editTabSelected"
            onBlur={(e) => {
              addResultForIfElse(
                propKey,
                activeFlow!,
                activeCondition!,
                name,
                sourceType
              );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addResultForIfElse(
                  propKey,
                  activeFlow!,
                  activeCondition!,
                  name,
                  sourceType
                );
              }
            }}
            onChange={(e) => setName(e.target.value)}
            value={name}
            type={
              ["decimal", "integer"].includes(sourceType)
                ? "number"
                : sourceType
            }
          />
        </Box>
      )}
    </ListItem>
  );
};
const mapStateToProps = (state: any) => {
  return {
    calculations: state.calculations,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteResult: (propKey: string, flowId: string, conditionIndex: number) => {
      dispatch(deleteResult(propKey, flowId, conditionIndex));
    },
    addResultForIfElse: (
      propKey: string,
      flowId: string,
      conditionIndex: number,
      sourceId: string,
      sourceType: string
    ) =>
      dispatch(
        addResultForIfElse(
          propKey,
          flowId,
          conditionIndex,
          sourceId,
          sourceType
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultCard);
