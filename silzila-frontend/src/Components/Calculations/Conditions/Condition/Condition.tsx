import { useDrag, useDrop } from "react-dnd";
import {
  addConditionForIfElse,
  deleteConditionFilter,
  deleteConditionFromIfElse,
  revert,
  sortConditionInIfElse,
  updateActiveConditionId,
  updateConditionTypeFlow,
  updateFlowCondition,
} from "../../../../redux/Calculations/CalculationsActions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ListItem } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { ICalculationStep } from "../../../../redux/Calculations/CurrentCalculationSessionInterface";
import { MenuItem, Select } from "@mui/material";
import ConditionName from "./ConditionName";
import { NotificationDialog } from "../../../CommonFunctions/DialogComponents";
import { fontSize, palette } from "../../../..";
const Condition = ({
  condition,
  allConditions,
  index,
  calculations,
  tabTileProps,
  addConditionForIfElse,
  updateActiveConditionId,
  updateFlowCondition,
  deleteCondition,
  deleteConditionFilter,
  reArrangeConditionInIfElse,
  revertConitionOrder,
  updateConditionTypeFlow,
}: {
  condition: ICalculationStep;
  allConditions: ICalculationStep[];
  index: number;
  calculations: any;
  tabTileProps: any;
  revertConitionOrder: (
    propKey: string,
    flowId: string,
    conditions: ICalculationStep[]
  ) => void;
  reArrangeConditionInIfElse: (
    propKey: string,
    flowId: string,
    dragConditionUid: string,
    dropConditionUid: string
  ) => void;
  addConditionForIfElse: (
    propKey: string,
    calculationFlow: { uid: string; flow: string },
    conditionUid: string,
    conditionType: string,
    activeConditionId: number
  ) => void;
  updateActiveConditionId: (propKey: string, activeConditionId: number) => void;
  updateFlowCondition: (
    propKey: string,
    calculationFlowUID: string,
    conditionIndex: number,
    condition: string
  ) => void;
  deleteCondition: (
    propKey: string,
    flowId: string,
    conditionUid: string
  ) => void;
  deleteConditionFilter: (propKey: string, conditionFilterUid: string) => void;
  updateConditionTypeFlow: (propKey: string, flowId: string) => void;
}) => {
  const propKey =
    tabTileProps.selectedTabId.toString() +
    "." +
    tabTileProps.selectedTileId.toString();
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;


  const activeCondition = currentCalculationSession.activeCondition;

  // const [activeCondition, setActiveCondition] = useState(currentCalculationSession.activeCondition)

  // useEffect(() => {
  //   console.log('index and con is: ', index, activeCondition)
  //   setActiveCondition(currentCalculationSession.activeCondition)
  // }, [currentCalculationSession])

  const activeFlow = currentCalculationSession.activeFlow;
  const activeFlowConditions: ICalculationStep[] =
    currentCalculationSession.calculationInfo.flows[activeFlow];
  const [openAlert, setOpenAlert] = useState(false);
  // const conditionsOrdersBeforeDrag = useRef<ICalculationStep[] | null>(null);
  // const [, drag] = useDrag({
  //   type: "condition",
  //   item: () => {
  //     conditionsOrdersBeforeDrag.current = allConditions;

  //     return {
  //       flowId: condition.flowId,
  //       index: index,
  //     }; // Unique identifier and index for drag
  //   },

  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging(),
  //   }),
  //   end: (dropResult, monitor) => {
  //     // const { uId, originalIndex } = monitor.getItem();

  //     const didDrop = monitor.didDrop();
  //     if (!didDrop)
  //     {
  //       revertConitionOrder(
  //         propKey,
  //         activeFlow,
  //         conditionsOrdersBeforeDrag.current!
  //       );
  //       conditionsOrdersBeforeDrag.current=null
  //     }
  //     // else updateConditionTypeFlow(propKey, activeFlow);
  //   },
  // });
  // const [, drop] = useDrop({
  //   accept: "condition",
  //   canDrop: () => false,
  //   collect: (monitor) => ({
  //     backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
  //   }),
  //   hover({ flowId: dragId, index: dragIndex }: any) {
  //     if (dragId !== condition.flowId) {

  //       reArrangeConditionInIfElse(
  //         propKey,
  //         activeFlow,
  //         dragId,
  //         condition.flowId
  //       );
  //     }
  //   },
  // });
  const allConditionTypes = useMemo(() => {
    return ["If", "Else If", "Else"];
  }, []);

  const handleDeleteCondition = (e: any, condition: ICalculationStep) => {
    e.stopPropagation();
    const ifCount = activeFlowConditions.filter(
      (_condition) => _condition.condition === "if"
    ).length;
    if (ifCount === 1 && condition.condition === "if") setOpenAlert(true);
    else {
      deleteCondition(propKey, activeFlow, condition.flowId);
      deleteConditionFilter(propKey, condition.filter ?? "");
    }
  };
  const safeToModifyCondition = (
    changeToConditionType: string,
    currConditionType: string,
    currIdx: number
  ): boolean => {
    if (currConditionType === "") return false;
    changeToConditionType = changeToConditionType === "If"
      ? "if"
      : changeToConditionType === "Else If"
        ? "elseIf"
        : "else";
    if (currConditionType === "ElseIf") {
      currConditionType = "Else If";
    }
    /**
     * if we change to same condition type then it is safe
     */
    if (currConditionType === changeToConditionType) return true;

    const totalConditionsCopunt = activeFlowConditions.length;

    if (currConditionType === "if") {
      return false;
      // const ifCount = activeFlowConditions.filter(
      //   (_condition) => _condition.condition === "If"
      // ).length;
      // /**
      //  * changing condition  to something from "if"  is not safe  if totalCondition is 1
      //  *
      //  * so  If  length is 1 changing  type  "if" to anything else is not safe
      //  */
      // if (totalConditionsCopunt === 1 || ifCount === 1) return false;
      // /**
      //  * senarios where we have multiple "if" conditions
      //  */
      // if (changeToConditionType === "Else") {
      //   /**
      //    * if there is no next condition then if -> else is safe
      //    */
      //   const nextCondition = activeFlowConditions[currIdx + 1];
      //   if (!nextCondition) return true;
      // } else if (changeToConditionType === "Else If") {
      //   const nextCondition = activeFlowConditions[currIdx + 1];
      //   if (!nextCondition || nextCondition.condition !== "If") return true;
      // }
    } else if (currConditionType === "elseIf") {
      /**
       * if currewnt condition is "else if" then  its safe to assume  that there is atleast one "if" condition
       *
       * and above "else if" there is only "if" condition or "else if" condition
       *
       */
      if (changeToConditionType === "else") {
        const nextCondition = activeFlowConditions[currIdx + 1];
        if (!nextCondition) return true;
      }
    } else {
      if (changeToConditionType === "elseIf") return true
    }
    return false;
  };
  return (
    <ListItem
      key={index}
      sx={{
        border:
          activeCondition === index ? "1px solid #2BBDCF" : "1px solid grey",
        borderRadius: "5px",
        marginBlock: "10px",
        padding: "0.3rem",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "1.5rem",
        width: "100%",
        cursor: activeCondition === index ? "default" : "pointer",
      }}
      onClick={(e) => {
        updateActiveConditionId(propKey, index);
      }}
    >
      <CloseRoundedIcon
        onClick={(e) => {
          handleDeleteCondition(e, condition);
        }}
        sx={{
          fontSize: fontSize.medium,
          cursor: "pointer",
          marginRight: "0.5rem",
          color:palette.primary.contrastText,
          "&:hover": {
            color: "red",
            transform: "scale(1.1)",
          },
        }}
      />
      <ConditionName
        conditionName={condition.conditionName}
        propKey={propKey}
        flowId={activeFlow}
        conditionUid={condition.flowId}
        index={index}
        activeCondition={activeCondition}
      />
      <Select
        value={
          condition.condition === "if"
            ? "If"
            : condition.condition === "elseIf"
              ? "Else If"
              : "Else"
        }
        onChange={(e) => {
          const updatedCondition =
            e.target.value === "If"
              ? "if"
              : e.target.value === "Else If"
                ? "elseIf"
                : "else";
          updateFlowCondition(propKey, activeFlow, index, updatedCondition);

        }}
        sx={{
          marginLeft: "auto",
          height: "1.5rem",
          // backgroundColor:'pink',
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          // ".MuiSelect-icon": {
          //   right: "0",
          //   height:'18px',
          //   width:'18px',
          // },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          textAlign: "left",
          ".MuiSelect-icon": {
            fontSize: "19px",
            marginLeft: "20px",
            color: palette.primary.contrastText,
            right: "3.5px",
          },
          fontSize: fontSize.medium,
        }}
        IconComponent={KeyboardArrowDownIcon}
      >
        {allConditionTypes.map((conditionType: string, _index: number) => {

          return (
            <MenuItem
              disabled={
                !safeToModifyCondition(
                  conditionType,
                  condition.condition ?? "",
                  index
                )
              }
              sx={{fontSize:fontSize.small,color:'primary.contrastText',height:'1.5rem'}}
              key={_index}
              value={conditionType}
            >
              {conditionType}
            </MenuItem>
          );
        })}
      </Select>
      <NotificationDialog
        severity="warning"
        testMessage="Cannot delete the first condition"
        openAlert={openAlert}
        onCloseAlert={() => {
          setOpenAlert(false);
        }}
      />
    </ListItem>
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
    updateConditionTypeFlow: (propKey: string, flowId: string) => {
      dispatch(updateConditionTypeFlow(propKey, flowId));
    },
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
    updateActiveConditionId: (propKey: string, activeConditionId: number) =>
      dispatch(updateActiveConditionId(propKey, activeConditionId)),
    updateFlowCondition: (
      propKey: string,
      calculationFlowUID: string,
      conditionIndex: number,
      condition: string
    ) =>
      dispatch(
        updateFlowCondition(
          propKey,
          calculationFlowUID,
          conditionIndex,
          condition
        )
      ),
    deleteCondition: (propKey: string, flowId: string, conditionUid: string) =>
      dispatch(deleteConditionFromIfElse(propKey, flowId, conditionUid)),
    deleteConditionFilter: (propKey: string, conditionFilterUid: string) =>
      dispatch(deleteConditionFilter(propKey, conditionFilterUid)),
    reArrangeConditionInIfElse: (
      propKey: string,
      flowId: string,
      dragConditionUid: string,
      dropConditionUid: string
    ) =>
      dispatch(
        sortConditionInIfElse(
          propKey,
          flowId,
          dragConditionUid,
          dropConditionUid
        )
      ),
    revertConitionOrder: (
      propKey: string,
      flowId: string,
      conditions: ICalculationStep[]
    ) => dispatch(revert(propKey, flowId, conditions)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Condition);
