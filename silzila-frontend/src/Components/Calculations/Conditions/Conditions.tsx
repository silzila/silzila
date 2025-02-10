import React, { useEffect, useMemo } from "react";
import Evaluations from "./Evaluation/Evaluations";
import Result from "./Result/Result";
import { connect } from "react-redux";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useDrop } from "react-dnd";
import {
  MenuItem,
  Menu,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Condition from "./Condition/Condition";
import {
  addConditionForIfElse,
  // deleteConditionFilter,
  // deleteConditionFromIfElse,
  // updateActiveConditionId,
  // updateFlowCondition,
} from "../../../redux/Calculations/CalculationsActions";
import { ICalculationStep } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import { fontSize } from "../../..";
const Conditions = ({
  calculations,
  tabTileProps,
  addConditionForIfElse
}: {
  calculations: any;
  tabTileProps: any;
  addConditionForIfElse: (
    propKey: string,
    calculationFlow: { uid: string; flow: string },
    conditionUid: string,
    conditionType: string,
    activeConditionId: number
  ) => void;
}) => {

  const [conditionType, setConditionType] = React.useState<string>("If");

  const [anchorEl, setAnchorEl] = React.useState<
    null | (EventTarget & HTMLButtonElement)
  >(null);
  const allConditionTypes = useMemo(() => {
    return ["Else If", "Else"];
  }, []);

  const propKey =
    tabTileProps.selectedTabId.toString() +
    "." +
    tabTileProps.selectedTileId.toString();
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  const conditionsLength = Object.keys(
    currentCalculationSession.calculationInfo.conditionFilters
  ).length;


  const activeFlow = currentCalculationSession.activeFlow;
  const activeFlowConditions: ICalculationStep[] =
    currentCalculationSession.calculationInfo.flows[activeFlow];
  const [, drop] = useDrop({
    accept: "condition",
    collect: (monitor) => ({
      backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
    }),
    hover({ uId: dragUId, bIndex: fromBIndex }: any) {
    },
  });
  const safeToCreateCondition = (conditionType: string): boolean => {
    /**
     * if last  condition is "else", then it is not safe to create a new condition
     */
    if (activeFlowConditions.at(-1)?.condition === "else") return false;
    /**
     * if last condition is "else if" then creating " else if" and "else" is safe but "if" is not safe
     */
    if (
      activeFlowConditions.at(-1)?.condition === "elseIf" &&
      conditionType === "If"
    )
      return false;
    /**
     * if last condition type is "if" then creating any condition is safe
     */
    return true;
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: "250px",
        // backgroundColor:"red"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" align="left" sx={{ paddingInline: "0.5rem", fontSize: fontSize.large, fontWeight: 600, color: 'primary.contrastText' }}>
          Conditions
          <Typography
            component="span"
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            {activeFlowConditions.length}/10
          </Typography>
        </Typography>
        <Tooltip title="Add Condition">
          <IconButton
            disabled={activeFlowConditions.length >= 10}
            onClick={(e: any) => setAnchorEl(e.currentTarget)}
            sx={{ padding: 0, marginRight: "0.35rem" }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {allConditionTypes.map((conditionType, index) => {
          return (<MenuItem
            disabled={!safeToCreateCondition(conditionType)}
            key={index}
            sx={{ width: "5rem", fontSize: fontSize.small, color: 'primary.contrastText' }}
            onClick={() => {
              addConditionForIfElse(
                propKey,
                {
                  uid: activeFlow,
                  flow: "IfElse",
                },
                `flt${conditionsLength + 1}`,
                conditionType.replace(/\s+/g, ""),
                Object.keys(
                  calculations.properties[propKey].currentCalculationSession
                    .calculationInfo.flows[activeFlow]
                ).length
              );
              setConditionType(conditionType.replace(/\s+/g, ""));
              setAnchorEl(null);
            }}
          >
            {conditionType}
          </MenuItem>
          );
        })}
      </Menu>

      <List disablePadding ref={drop} sx={{ paddingLeft: '0.5rem', paddingRight: "0.35rem" }}>
        {activeFlowConditions.map((condition, index: number) => {
          console.log(index, condition.conditionName)
          return (
            <Condition
              key={index}
              index={index}
              condition={condition}
              allConditions={activeFlowConditions}
            />
          );
        })}
      </List>

      <Evaluations />
      <Result />

    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    calculations: state.calculations,
    tabTileProps: state.tabTileProps,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    addConditionForIfElse: (
      propKey: string,
      calculationFlow: { uid: string; flow: string },
      conditionUid: string,
      conditionType: string,
      activeConditionId: number
    ) =>
      dispatch(
        addConditionForIfElse(
          propKey,
          calculationFlow,
          conditionUid,
          conditionType,
          activeConditionId
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Conditions);
