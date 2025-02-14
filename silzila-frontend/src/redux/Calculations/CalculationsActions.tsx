// 'There are places where variable names are not descriptive enough. For example, the variable name "condition" is not descriptive enough. It is better to use "step" or "conditionNumber" instead.'
// 'In such cases I have tried to leave a comment explaining the reason for the change. But I might have missed some cases. Please review the code and provide feedback if you find any issues.'

import { IEvaluationCondition } from "../../Components/Calculations/Conditions/Evaluation/EvaluationInterface";
import { IRelativeCondition } from "../../Components/DataSet/BottomBarInterfaces";
import { ICalculationSession, ICalculationStep } from "./CurrentCalculationSessionInterface";

export const addNewCalculationSession = (
  propKey: string,
  calculationName: string,
  datasetId: string
) => {
  // 'Before adding a new calculation session, check if it already exists, If it does, do not add it instead, return error'
  // 'above is a pending task'

  return {
    type: "ADD_NEW_CALCULATION_SESSION",
    payload: {
      propKey,
      calculationName,
      datasetId
    },
  };
};

export const addInitialCalculationFlow = (
  propKey: string,
  calculationFlow: { uid: string; flow: string, isAggregation: boolean },
  conditionUid: string,
  flowDisplayName?: string
) => {
  return {
    type: "ADD_INITIAL_CALCULATION_FLOW",
    payload: {
      propKey,
      calculationFlow,
      conditionUid,
      flowDisplayName,
    },
  };
};
export const addConditionForIfElse = (
  propKey: string,
  calculationFlow: { uid: string; flow: string },
  conditionUid: string,
  conditionType: string,
  activeConditionId: number
) => {
  return {
    type: "ADD_CONDITION_FOR_IF_ELSE",
    payload: {
      propKey,
      calculationFlow,
      conditionUid,
      conditionType,
      activeConditionId,
    },
  };
};
export const addSourceInfoInCalculationFlow = (
  tableId: string,
  calculationFlow: { uid: string; flow: string },
  propKey: string,
  dataType: string,
  isAggregation: boolean,
  aggregation: string,
  conditionNumber: number
) => {
  return {
    type: "ADD_SOURCE_INFO_IN_CALCULATION_FLOW",
    payload: {
      tableId,
      calculationFlow,
      propKey,
      dataType,
      isAggregation,
      aggregation,
      conditionNumber,
    },
  };
};

export const addCalculationField = (
  propKey: string,
  calculationFieldUID: string,
  calculationField: {
    tableId: string;
    fieldName: string;
    displayName: string;
    dataType: string;
  }
) => {
  return {
    type: "ADD_CALCULATION_FIELD",
    payload: {
      propKey,
      calculationFieldUID,
      calculationField,
    },
  };
};

export const saveNewCalculation = (propKey: string, uuid: string) => {
  return {
    type: "SAVE_CALCULATION",
    payload: {
      uuid,
      propKey,
    },
  };
};

export const setFlowPositions = (
  propKey: string,
  calculationFlowUID: string,
  x: string,
  y: string
) => {
  return {
    type: "SET_FLOW_POSITIONS",
    payload: {
      propKey,
      calculationFlowUID,
      x,
      y,
    },
  };
};

export const setIsAggregated = (
  propKey: string,
  step: number,
  calculationFlowUID: string,
  isAggregated: boolean
) => {
  return {
    type: "SET_IS_AGGREGATED",
    payload: {
      propKey,
      calculationFlowUID,
      isAggregated,
      step,
    },
  };
};

export const setActiveFlow = (propKey: string, calculationFlowUID: string) => {
  return {
    type: "SET_ACTIVE_FLOW",
    payload: {
      propKey,
      calculationFlowUID,
    },
  };
};

export const deleteFlow = (propKey: string, flowUID: string) => {
  return {
    type: "DELETE_FLOW",
    payload: {
      propKey,
      flowUID,
    },
  };
};

export const deleteSourceFromFlow = (
  calculationFlowUID: string,
  sourceUID: string,
  propKey: string,
  sourceIndex: number
) => {
  // This variable name suggests that it deletes the source only from flow but it actually deletes the source from flow, source and condition filter too.
  // have not changed the variable name not to break the existing code

  return {
    type: "DELETE_SOURCE",
    payload: {
      calculationFlowUID,
      sourceUID,
      propKey,
      sourceIndex,
    },
  };
};
export const deleteSourceV2 = (
  calculationFlowUID: string,
  sourceUID: string,
  propKey: string,
  sourceIndex: number,
  filterIdx: number
) => {
  return {
    type: "DELETE_SOURCE_V2",
    payload: {
      calculationFlowUID,
      sourceUID,
      propKey,
      sourceIndex,
      filterIdx,
    },
  };
};
export const moveSourceCard = (
  dragIndex: number,
  hoverIndex: number,
  propKey: string,
  calculationFlowUID: string,
  step: number
) => {
  return {
    type: "MOVE_SOURCE_CARD",
    payload: {
      dragIndex,
      hoverIndex,
      propKey,
      calculationFlowUID,
      step,
    },
  };
};

export const updateSourceAggregation = (
  propKey: string,
  calculationFlowUID: string,
  step: number,
  sourceIndex: number,
  newAggregation: string
) => {
  return {
    type: "UPDATE_SOURCE_AGGREGATION",
    payload: {
      propKey,
      calculationFlowUID,
      step,
      sourceIndex,
      newAggregation,
    },
  };
};

export const updateFlowPositions = (
  propKey: string,
  calculationFlowUID: string,
  x: string,
  y: string
) => {
  return {
    type: "UPDATE_FLOW_POSITIONS",
    payload: {
      propKey,
      calculationFlowUID,
      x,
      y,
    },
  };
};

export const addConditionFilter = (propKey: string, conditionFilter: any) => {
  return {
    type: "ADD_CONDITION_FILTER",
    payload: {
      propKey,
      conditionFilter,
    },
  };
};

export const updateSearchConditionFilter = (
  propKey: string,
  conditionFilterUid: string,
  sourceUid: string,
  shouldExclude: boolean
) => {
  return {
    type: "UPDATE_SEARCH_CONDITION_FILTER",
    payload: {
      propKey,
      conditionFilterUid,
      sourceUid,
      shouldExclude,
    },
  };
};
export const updateConditionFilter = (
  propKey: string,
  conditionFilterUid: string,
  sourceUid: string,
  conditionFilter: {
    filterType: string;
    rightOperand: (string | number | null)[];
    rightOperandType: string[];
    operator: string;
    shouldExclude: boolean;
    isTillDate: boolean;
    timeGrain: string;
    relativeCondition: IRelativeCondition | null;
  },
  filterIdx: number
) => {
  return {
    type: "UPDATE_CONDITION_FILTER",
    payload: {
      propKey,
      conditionFilterUid,
      sourceUid,
      conditionFilter,
      filterIdx,
    },
  };
};
export const updateFilterOperator = (
  propKey: string,
  conditionFilterUid: string,
  sourceUid: string,
  operator: string
) => {
  return {
    type: "UPDATE_FILTER_OPERATOR",
    payload: {
      propKey,
      conditionFilterUid,
      sourceUid,
      operator,
    },
  };
};

export const updateTimeGrain = (
  propKey: string,
  conditionFilterUid: string,
  filterIdx: number,
  timeGrain: string
) => {
  return {
    type: "UPDATE_TIMEGRAIN",
    payload: {
      propKey,
      conditionFilterUid,
      filterIdx,
      timeGrain,
    },
  };
};

export const toggleIsTillDate = (
  propKey: string,
  conditionFilterUid: string,
  sourceIndex: number
) => {
  return {
    type: "TOGGLE_IS_TILL_DATE",
    payload: {
      propKey,
      conditionFilterUid,
      sourceIndex,
    },
  };
};

export const updateActiveConditionId = (
  propKey: string,
  activeConditionId: number
) => {
  return {
    type: "UPDATE_ACTIVE_CONDITION_ID",
    payload: {
      propKey,
      activeConditionId,
    },
  };
};
export const updateFlowCondition = (
  propKey: string,
  calculationFlowUID: string,
  conditionIndex: number,
  condition: string
) => {
  return {
    type: "UPDATE_FLOW_CONDITION",
    payload: {
      propKey,
      calculationFlowUID,
      conditionIndex,
      condition,
    },
  };
};
export const updateConditionName = (
  propKey: string,
  flowId: string,
  conditionUid: string,
  conditionName: string
) => {
  return {
    type: "UPDATE_CONDITION_NAME",
    payload: {
      propKey,
      conditionUid,
      conditionName,
      flowId,
    },
  };
};
export const deleteConditionFromIfElse = (
  propKey: string,
  flowId: string,
  conditionUid: string
) => {
  return {
    type: "DELETE_CONDITION_FROM_IF_ELSE",
    payload: {
      propKey,
      flowId,
      conditionUid,
    },
  };
};
export const deleteConditionFilter = (
  propKey: string,
  conditionFilterUid: string
) => {
  return {
    type: "DELETE_CONDITION_FILTER",
    payload: {
      propKey,
      conditionFilterUid,
    },
  };
};
export const sortConditionInIfElse = (
  propKey: string,
  flowId: string,
  dragConditionUid: string,
  dropConditionUid: string
) => {
  return {
    type: "SORT_CONDITION_IN_IF_ELSE",
    payload: {
      propKey,
      flowId,
      dragConditionUid,
      dropConditionUid,
    },
  };
};
export const revert = (
  propKey: string,
  flowId: string,
  conditionList: ICalculationStep[]
) => {
  return {
    type: "REVERT",
    payload: {
      propKey,
      flowId,
      conditionList,
    },
  };
};
export const updateConditionTypeFlow = (propKey: string, flowId: string) => {
  return {
    type: "CORRECT_CONDITION_TYPE_FLOW",
    payload: {
      propKey,
      flowId,
    },
  };
};

export const updateDecimalSourceValue = (
  propKey: string,
  sourceIndex: number,
  value: number
) => {
  return {
    type: "UPDATE_DECIMAL_SOURCE_VALUE",
    payload: {
      propKey,
      sourceIndex,
      value,
    },
  };
};

export const updateFlowDisplayName = (
  propKey: string,
  flowUID: string,
  displayName: string
) => {
  return {
    type: "UPDATE_FLOW_DISPLAY_NAME",
    payload: {
      propKey,
      flowUID,
      displayName,
    },
  };
};

export const updateCalculationName = (
  propKey: string,
  calculationName: string
) => {
  return {
    type: "UPDATE_CALCULATION_NAME",
    payload: {
      propKey,
      calculationName,
    },
  };
};

export const resetCurrentCalculationSession = (propKey: string) => {
  return {
    type: "RESET_CALCULATION_SESSION",
    payload: {
      propKey,
    },
  };
};

export const addResultForIfElse = (
  propKey: string,
  flowId: string,
  conditionIndex: number,
  sourceId: string,
  sourceType: string
) => {
  return {
    type: "ADD_RESULT_FOR_IF_ELSE",
    payload: {
      propKey,
      flowId,
      conditionIndex,
      sourceId,
      sourceType,
    },
  };
};

export const setResultTypeForIfElse = (
  propKey: string,
  flowId: string,
  resultType: string | null
) => {
  return {
    type: "SET_RESULT_TYPE_FOR_IF_ELSE",
    payload: {
      propKey,
      flowId,
      resultType,
    },
  };
};
export const resetResultForIfElse = (
  propKey: string,
  flowId: string,
  conditionIndex: number
) => {
  return {
    type: "RESET_RESULT_FOR_IF_ELSE",
    payload: {
      propKey,
      flowId,
      conditionIndex,
    },
  };
};

export const deleteResult = (
  propKey: string,
  flowId: string,
  conditionIndex: number
) => {
  return {
    type: "DELETE_RESULT_FOR_IF_ELSE",
    payload: {
      propKey,
      flowId,
      conditionIndex,
    },
  };
};

export const editSavedCalculation = (
  propKey: string,
  calculationFieldName: string
) => {
  return {
    type: "EDIT_SAVED_CALCULATION",
    payload: {
      propKey,
      calculationFieldName,
    },
  };
};

export const deleteSavedCalculation = (
  calculationFieldName: string,
  propKey: string
) => {
  return {
    type: "DELETE_SAVED_CALCULATION",
    payload: {
      calculationFieldName,
      propKey,
    },
  };
};

export const setSource = (
  propKey: string,
  flowId: string,
  subFlowId: number,
  source: any,
  sourceType: string,
  sourceIndex: number
) => {
  return {
    type: "SET_SOURCE",
    payload: {
      propKey,
      flowId,
      subFlowId,
      source,
      sourceType,
      sourceIndex,
    },
  };
};
export const resetSource = (
  propKey: string,
  flowId: string,
  subFlowId: number
) => {
  return {
    type: "RESET_SOURCE",
    payload: {
      propKey,
      flowId,
      subFlowId,
    },
  };
};

/**
 * 
 * @param propKey 
 * @param flowId 
 * @param subFlowId 
 * @param source 
 * @param sourceType 
 * @param sourceIndex 
 * @returns void
 *  if @param sourceIndex is undefined or  outside source length  then value is pushed at the end else it update the existing value
 */
export const addSource = (
  propKey: string,
  flowId: string,
  subFlowId: number,
  source: any,
  sourceType: string,
  sourceIndex?: number,
) => {
  return {
    type: "ADD_SOURCE_WITH_RESTRICTION",
    payload: {
      propKey,
      flowId,
      subFlowId,
      source,
      sourceType,
      sourceIndex,
    },
  };
};

export const deleteSourceV3=(propKey: string,
  flowId: string,
  subFlowId: number,
  sourceIndex?: number)=>{
    return {
        type: "DELETE_SOURCE_V4",
        payload: {
            propKey,
            flowId,
            subFlowId,
            sourceIndex
        }
    }
  }
export const updateSource = (propKey: string, sourceIndex: number, newSourceValue: string) => {
    return {
        type: "UPDATE_SOURCE",
        payload: {
            propKey,
            sourceIndex,
            newSourceValue
        }
    }
}

export const addTableIdToCurrentCalculationSession = (tableId: string, propKey: string) => {
    return {
        type: "ADD_TABLE_ID_TO_CURRENT_CALCULATION_SESSION",
        payload: {
            tableId,
            propKey
        }
    }
}

export const setCalculationsState = (calculations:ICalculationSession) => {
    return {
        type: "SET_CALCULATION_STATE",
        payload: {
            calculations
        }
    }
}


export const resetCalculationState = () => {
	return { type: "RESET_CALCULATION_STATE" };
};