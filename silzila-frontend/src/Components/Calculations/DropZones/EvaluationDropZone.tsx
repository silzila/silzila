import React, { useMemo } from "react";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
  addCalculationField,
  addConditionFilter,
  updateSearchConditionFilter,
} from "../../../redux/Calculations/CalculationsActions";

const EvaluationDropZone = ({
  calculations,
  tabTileProps,
  children,
  addSourceInfoInCalculationFlow,
  addCalculationField,
  addConditionFilter,
  updateSearchConditionFilter,
}: {
  calculations: any;
  tabTileProps: any;
  children: React.ReactNode;
  addSourceInfoInCalculationFlow: (
    tableId: string,
    calculationFlow: { uid: string; flow: string },
    propKey: string,
    dataType: string,
    isAggregation: boolean,
    aggregation: string,
    conditionNumber: number
  ) => void;
  addCalculationField: (
    propKey: string,
    calculationFieldUID: string,
    calculationField: any
  ) => void;
  addConditionFilter: (propKey: string, conditionFilter: any) => void;
  updateSearchConditionFilter: (
    propKey: string,
    conditionFilterUid: string,
    sourceUid: string,
    shouldExclude: boolean
  ) => void;
}) => {

  const propKey =
    tabTileProps.selectedTabId.toString() +
    "." +
    tabTileProps.selectedTileId.toString();
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  const uid = new ShortUniqueId({ length: 4 });
  const conditionNumber = currentCalculationSession.activeCondition;
  // introduce step
  const aggregation =
    currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
    ][conditionNumber === null ? 0 : conditionNumber].isAggregation;
    const selectedFlow = currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
    ][conditionNumber];
  const [, dropEvaluation] = useDrop({
    accept: "card",
    canDrop: () => selectedFlow.condition!=="Else",
    drop(item:any) {
        if (!item.fieldData) return;
        /**
         * item.type===card -> dropped item is a field i.e column of table
         */
        if (item.type === "card") {
          const uId = uid();
          if (!uId) return;

          const itemDataType = item.fieldData.dataType;

          

          // addSourceInfoInCalculationFlow(
          //   uId,
          //   {
          //     uid: currentCalculationSession.activeFlow,
          //     flow: "IfElse",
          //     // change sum, put a select input for the user to choose the aggregation
          //   },
          //   propKey,
          //   item.fieldData.dataType,
          //   aggregation,
          //   "sum",
          //   conditionNumber
          // );
          addCalculationField(propKey, uId, {
            tableId: item.fieldData.tableId,
            fieldName: item.fieldData.fieldname,
            displayName: item.fieldData.displayname,
            dataType: item.fieldData.dataType,
          });
          if (itemDataType === "date" || itemDataType === "timestamp") {
            addConditionFilter(propKey,
                {
                  conditionUID: uid(),
                  filterType:"Pick List",
                  leftOperand: [item.type === "card" ? uId : "flow"],// tobe modified later based on other dropped itemn type
                  leftOperandType: [item.type === "card" ?"field" : "flow"],
                  operator: "in",
                  rightOperand: [],
                  rightOperandType: [],
                  shouldExclude: false,
                  isTillDate: false,
                  relativeCondition: null,
                  timeGrain: "year",
                  isValid: true,
                },
            );
          } else {
            addConditionFilter(propKey, 
                {
                  conditionUID: uid(),
                  filterType:["integer", "decimal", "float"].includes(itemDataType)
                    ? "Search Condition"
                    : "Pick List",
                  leftOperand: [item.type === "card" ? uId : "flow"],// tobe modified later based on other dropped itemn type
                  leftOperandType: [item.type === "card" ?"field" : "flow"],// tobe modified later based on other dropped itemn type
                  operator: ["integer", "decimal", "float"].includes(itemDataType)?"greaterThan":"in",
                  rightOperand: [],
                  rightOperandType: [],
                  shouldExclude: false,
                  isTillDate: false,
                  relativeCondition: null,
                  isValid: ["integer", "decimal", "float"].includes(itemDataType)?false:true,
                },
            );
          }
        }
      }
    },);

  return (
    <div
      ref={dropEvaluation}
      style={{
        cursor: "pointer",
        margin: "0",
        textAlign: "left",
        paddingBottom: "10px",
        paddingTop: "5px",
        minHeight:"8rem",
        // backgroundColor:'red',
        paddingInline:'0.5rem',
      }}
    >
      {children}
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
    addCalculationField: (
      propKey: string,
      calculationFieldUID: string,
      calculationField: any
    ) =>
      dispatch(
        addCalculationField(propKey, calculationFieldUID, calculationField)
      ),
    addConditionFilter: (propKey: string, conditionFilter: any) =>
      dispatch(addConditionFilter(propKey, conditionFilter)),
    updateSearchConditionFilter: (
      propKey: string,
      conditionFilterUid: string,
      sourceUid: string,
      shouldExclude: boolean
    ) =>
      dispatch(
        updateSearchConditionFilter(
          propKey,
          conditionFilterUid,
          sourceUid,
          shouldExclude
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EvaluationDropZone);
