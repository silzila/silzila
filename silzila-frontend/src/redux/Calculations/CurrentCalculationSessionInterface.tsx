import { SavedCalculations } from "./SavedCalculationsInterface"

export interface ICalculationSession {
    properties: {
        [key: string]: {
            currentCalculationSession: null | ICurrentCalculationSession,
        }
    },
    propList: {
        [key: number]: string[]
    },
    savedCalculations: any
}

export interface ICurrentCalculationSession {
    name: string,
    calculationInfo?: {
        selectedResultType: {
            [key: string]: string | null
        }
        flows: {
            [key: string]: ICalculationStep[]
        },
        fields: ICalculationFields,
        conditionFilters: IConditionFilters
    },
    calculationStepXYOffsets?: {
        // the key here is the uId
        [key: string]: {
            x: number,
            y: number
        }
    },
    flowPositions: {
        [key: string]: {
            x: number,
            y: number
        }
    },
    activeFlow: string | null,
    activeFlowType: string | null,
    activeCondition: number | null,
    flowDisplayNames: {

        // the key here is the uId
        [key: string]: string
    },
    tableId?: string,
    datasetId?: string,
}

export interface ICalculationStep {
    flowId: string,
    flow: string,
    sourceType: string[],
    source: any[],
    isAggregation: boolean,
    aggregation: Array<string | null>,
    filter: string | null,
    condition: string | null
    conditionName: string,
    isValid: boolean,
}

export interface ICalculationFields {
    [key: string]: {
        tableId: string,
        fieldName: string,
        displayName: string,
        dataType: string,
    }
}

interface ICondition {
    leftOperand: string[];
    leftOperandType: string[];
    operator: string;
    rightOperand: any[] | null;
    rightOperandType: string[] | null;
    shouldExclude: boolean;
    isTillDate: boolean;
    relativeCondition: string | null;
    timeGrain: string;
    conditionUID: string;
    filterType: string;
    isValid: boolean;
}

interface IConditionFilter {
    shouldAllConditionsMatch: boolean;
    lastDroppedEvaluationUid: string | null;
    conditions: ICondition[];
}

interface IConditionFilters {
    [filterName: string]: IConditionFilter[];
}