import Logger from "../../../Logger";
export const setCellColor = (isHeader:boolean,crossTabData: any, colIndex: number, rowIndex: number, colData: any, chartProperties: any, propKey: string, chartControls: any): object => {
    let isConditionAvailable = checkChartControlConditionalColor(chartProperties, propKey,chartControls);
    let _conditionalStyle : any = getConditionalFormat(crossTabData, colIndex, rowIndex, colData, chartProperties, propKey, chartControls) || {};
    let _crossTabStyle = isHeader ? chartControls.properties[propKey].crossTabHeaderLabelOptions : chartControls.properties[propKey].crossTabCellLabelOptions;
    let style = {
        color : isConditionAvailable ? _conditionalStyle.fontColor : 
                    _crossTabStyle.labelColor,
        fontWeight : isConditionAvailable ? _conditionalStyle.isBold ? "bold" : "normal" : 
                    _crossTabStyle.fontWeight,
        fontSize : _crossTabStyle.fontSize,
        borderWidth : chartControls.properties[propKey].crossTabStyleOptions.borderWidth,
        backgroundColor : _conditionalStyle.backgroundColor,
        textDecoration : _conditionalStyle.isUnderlined ? 'underline' : "",
        fontStyle : _conditionalStyle.isItalic ? 'italic' : "normal"
    }

        return style;
    }
    catch (err) {
        console.error(err);
        return {};
    }
};

const checkChartControlConditionalColor = (chartProperties: any, propKey: string, chartControls: any): boolean => {

    switch (chartProperties.properties[propKey].chartType) {
        case "table":
            return chartControls.properties[propKey]?.tableConditionalFormats?.length > 0
    }

    return false;
}

const getConditionalFormat = (crossTabData: any, colIndex: number, rowIndex: number, colData: any, chartProperties: any, propKey: string, chartControls: any) => {
    try {
        // if(colData == '270'){
        //     console.log('sum of quantity')
        // }
        let _colNameConditions:any = {};
        let colName = getColumnName(crossTabData, colIndex, chartProperties, propKey);

    if(colData == '270'){
        Logger("info" ,"sum of quantity");
    }

        let colNameConditions = _tableConditionalFormats?.find((item: any) => {
            return item.name === colName;
        });

        if(colNameConditions)
            _colNameConditions = JSON.parse(JSON.stringify(colNameConditions));

        if (Object.keys(_colNameConditions).length > 0) {
            if (_colNameConditions?.isGradient) {
                return getGradientBasedStyle(_colNameConditions, crossTabData, rowIndex, colData);
            }
            else {  //Rule Based
                let field = getColumnField(colIndex, chartProperties, propKey);

                switch (field.dataType) {

                    case 'text':
                        return _colNameConditions.value.find((item: any) => item.colValue === colData)
                    default:
                        if (!isNaN(colData) && !isNaN(colData.toString().substring(colData.length - 1))) {
                            let lastSatisfiedCondition = getLastSatisfiedCondition(colData, _colNameConditions);
                            return lastSatisfiedCondition || {};
                        }
                        else if (['K', 'M', 'B', 'T'].includes(colData.toString().substring(colData.length - 1))) {
                            let lastSatisfiedCondition = getLastSatisfiedCondition(getActualNumber(colData), _colNameConditions);
                            return lastSatisfiedCondition || {};
                        }
                        else {
                            return {};
                        }
                }
            }

        }
        else {
            return {};
        }
    }
    catch (err) {
        console.error(err);
    }
}

const getGradientBasedStyle = (_colNameConditions: any, crossTabData: any, rowIndex: number, colData: any) => {
    let startStyle:any = {}, midStyle:any = {}, endStyle:any = {};

    if (_colNameConditions.value.length === 4) {
        midStyle = _colNameConditions.value.find((item: any) => item.name?.trim() == 'Mid Value');
    }

    startStyle = _colNameConditions.value.find((item: any) => item.name == 'Min');
    endStyle = _colNameConditions.value.find((item: any) => item.name == 'Max');

    return checkColumnValueForGradient(startStyle, midStyle, endStyle, crossTabData, colData);
}

const checkColumnValueForGradient = (startStyle: any, midStyle: any, endStyle: any, crossTabData: any, colData: any)=>{
    let _colValue:Number = 0;

    if(isNaN(colData.toString().substring(0, 1))){
        return {};
    }
    else if (!isNaN(colData) && !isNaN(colData.toString().substring(colData.length - 1))) {
        _colValue = Number(colData);
    }
    else if (['K', 'M', 'B', 'T'].includes(colData.toString().substring(colData.length - 1))) {
        _colValue = Number(getActualNumber(colData));
    }

    if(Number(_colValue) < Number(startStyle.value)){
        return startStyle;
    }
    else if(Number(_colValue) > Number(endStyle.value)){
        return endStyle;
    }
    else{
        let stepNumber = 20;

        if(Object.keys(midStyle).length > 0){
            if(Number(midStyle.value) > Number(_colValue)){

            }
            else{

            }
        }
        else {
            let step = calculateStep(Number(startStyle.value), Number(endStyle.value), stepNumber, Number(_colValue));
            let colors = interpolateColor(startStyle?.backgroundColor, endStyle?.backgroundColor, stepNumber);
            let style:any = {};

            if(step || 0 < 10){
                style = startStyle;
            }
            else{
                style = endStyle;
            }

            if (colors[step || 0]) {
                style.backgroundColor = colors[step || 0];
            }

            return style;
        }

        return {};
    }

   // let colors = interpolateColor(startStyle?.backgroundColor, endStyle?.backgroundColor, crossTabData.length - 2);

    let style = startStyle;

    // if (colors[rowIndex]) {
    //     style.backgroundColor = colors[rowIndex];
    // }

    return style;
}




const calculateStep = (minValue:number, maxValue:number, stepSize:number, value:number) => {
    if (stepSize <= 0) {
      throw new Error('Step size must be greater than 0.');
    }
  
    const range = maxValue - minValue;
    const steps = Math.ceil(range / stepSize);
  
    for(let i = 1; i<= stepSize; i++){
        if(minValue + (steps * i) > value){
            return i - 1
        }
    }
  }



const getActualNumber = (colData: string) => {
    try {
        switch (colData.substring(colData.length - 1)) {
            case 'B':
                return (Math.abs(Number(colData.toString().substring(0, colData.length - 1))) * 1.0e9);
            case 'M':
                return (Math.abs(Number(colData.toString().substring(0, colData.length - 1))) * 1.0e6)
            case 'K':
                return (Math.abs(Number(colData.toString().substring(0, colData.length - 1))) * 1.0e3)
            default:
                return Number(colData);
        }
    }
    catch (err) {
        console.error(err);
    }
}

const getColumnField = (colIndex: number, chartProperties: any, propKey: string) => {

    let columns: any = [];

    for (let i = 1; i < chartProperties.properties[propKey].chartAxes.length; i++) {
        chartProperties.properties[propKey].chartAxes[i].fields.forEach((field: any) => {
            columns.push(field)
        })
    }

    return columns[colIndex] || {};
}

const getLastSatisfiedCondition = (value: any, colNameConditions: any) => {
    for (let i = colNameConditions.value.length - 1; i >= 0; i--) {
        let item = colNameConditions.value[i];

        if (checkNumberAgaintConditionType(item.conditionType, item.target, value, item.minValue, item.maxValue)) {
            return colNameConditions.value[i];
        }
    }
}

const checkNumberAgaintConditionType = (conditionType: number, target: number, value: number, minValue: number, maxValue: number): boolean => {
    let result = false;

    value = Number(value);
    target = Number(target);

    switch (conditionType) {
        case 1://greater than
            result = value > target;
            break;
        case 2://less than
            result = value < target;
            break;
        case 3://>=
            result = value >= target;
            break;
        case 4://<= than
            result = value <= target;
            break;
        case 5://=
            result = value === target;
            break;
        case 6://<>
            result = value !== target;
            break;
        case 7://between
            if (minValue < value && value < maxValue) {
                result = true;
            }
            else {
                result = false;
            }

            break;
        default:
            result = false;
            break;
    }
    return result;
}

const getColumnName = (crossTabData: any, colIndex: number, chartProperties: any, propKey: string): string => {
    switch (chartProperties.properties[propKey].chartType) {
        case "table":
            return crossTabData[0].columnItems[colIndex].displayData;
    }

    return "";
}

const interpolateColor = (startColor: any, endColor: any, steps: any) => {
    const colorMap = (value: any, start: any, end: any) => start + Math.round(value * (end - start));
    const parseColor = (color: any) => color?.match(/\w\w/g)?.map((hex: any) => parseInt(hex, 16));

    const startRGB = parseColor(startColor);
    const endRGB = parseColor(endColor);

    return Array.from({ length: steps }, (_, index) => {
        const t = index / (steps - 1);
        return `rgb(${colorMap(t, startRGB[0], endRGB[0])},${colorMap(t, startRGB[1], endRGB[1])},${colorMap(t, startRGB[2], endRGB[2])})`;
    });
};

