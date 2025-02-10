import { functionDefinitions } from './constants'

export const getFlowTypeFromFunctionName = (functionName: string) => {


    const allFunctions = Object.keys(functionDefinitions).filter(key => key !== 'All');

    const functionType = allFunctions.find(type => functionDefinitions[type].some(func => (func.flowName ? func.flowName : func.fieldName) === functionName));

    return functionType || null;


}

export const getFlowFieldNameIfExists = (functionName: string) => {
    // only for string and number functions, not sure about date, condition, aggregation
    
    return functionDefinitions.All.find(func => (func.flowName ? func.flowName : func.fieldName) === functionName)?.fieldName || null;

}