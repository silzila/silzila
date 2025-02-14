import { IRelativeCondition } from "../../../DataSet/BottomBarInterfaces";

export interface IEvaluationMetrics {
    displayName:string;
    dataType:string;
    shouldExclude:boolean;
    operator:string;
    selection:(string|number|null)[];
    allOptions:(string|number|null)[];
    isTillDate:boolean;
    timeGrain:string;
    isCollapsed:boolean;
    relativeCondition:IRelativeCondition|null;
    filterType:string;
    isValid:boolean;
}
export interface IEvaluationCondition{
    conditionUID:string;
    filterType:string;
    leftOperand:(string|number|null)[];
    rightOperand:(string|number|null)[];
    leftOperandType:string[];
    rightOperandType:string[];
    operator:string;
    shouldExclude:boolean;
    isTillDate:boolean;
    timeGrain:string;
    relativeCondition:IRelativeCondition|null;
    isValid:boolean;
}
export interface IConditionFilter{
    shouldAllConditionsMatch:boolean;
    lastDroppedEvaluationUid:string|null
    conditions:IEvaluationCondition[];
}
export interface IField{
    tableId:string;
    fieldName:string;
    displayName:string;
    dataType:string;
}
