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
};

const checkChartControlConditionalColor = (chartProperties: any, propKey: string, chartControls: any) : boolean=>{

    switch(chartProperties.properties[propKey].chartType){
        case "table":
         return   chartControls.properties[propKey]?.tableConditionalFormats?.length > 0
    }

    return false;
}

const getConditionalFormat = (crossTabData: any,colIndex: number, rowIndex : number, colData: any, chartProperties: any, propKey: string, chartControls: any) =>{

    if(colData == '270'){
        Logger("info" ,"sum of quantity");
    }

    let colName = getColumnName(crossTabData,colIndex, chartProperties, propKey );
       
    let colNameConditions = chartControls.properties[propKey].tableConditionalFormats.find((item:any)=>{
        return item.name === colName;
    });
    
    if(colNameConditions){
        if(colNameConditions.isGradient){
          let colors =  interpolateColor(colNameConditions.value[0].backgroundColor,colNameConditions.value[2].backgroundColor, crossTabData.length - 2);
          let style = colNameConditions.value[1];

          if(colors[rowIndex]){
            style.backgroundColor = colors[rowIndex];

          }

          return style;
        }
        else{
            let field = getColumnField(colIndex,chartProperties,propKey);

            switch(field.dataType){
              
                case 'text':
                    return colNameConditions.value.find((item:any)=> item.colValue === colData)
                default:
                    if(!isNaN(colData)){
                        let lastSatisfiedCondition = getLastSatisfiedCondition(colData, colNameConditions);
                        return lastSatisfiedCondition || {};
                    }
                    else{
                        return {};
                    }
            }
        }
       
    }
    else{
        return {};
    }
   
}

const getColumnField = (colIndex: number, chartProperties: any, propKey: string) =>{

    let columns:any = [];

    for(let i = 1; i < chartProperties.properties[propKey].chartAxes.length; i++){
        chartProperties.properties[propKey].chartAxes[i].fields.forEach((field:any)=>{
            columns.push(field)
        })
    }
    
    return columns[colIndex] || {};
}

const getLastSatisfiedCondition = (value:any, colNameConditions:any)=>{
    for(let i = colNameConditions.value.length - 1; i >= 0 ; i--){
        let item = colNameConditions.value[i];

        if(checkNumberAgaintConditionType(item.conditionType, item.target,value,item.minValue,item.maxValue)){
            return colNameConditions.value[i]; 
        }
    }
}

const checkNumberAgaintConditionType = (conditionType: number, target:number, value:number, minValue:number, maxValue:number) : boolean=>{
    let result = false;

    switch(conditionType){
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
        if(minValue < value && value < maxValue ){
            result = true;
        }
        else{
            result = false;
        }

        break;
        default:
            result = false;
        break;        
    }
    return result;
}

const getColumnName = (crossTabData: any, colIndex: number, chartProperties: any, propKey: string) : string=>{
    switch(chartProperties.properties[propKey].chartType){
        case "table":
         return crossTabData[0].columnItems[colIndex].displayData;
    }

    return "";
}

const interpolateColor = (startColor:any, endColor:any, steps:any) => {
    const colorMap = (value:any, start:any, end:any) => start + Math.round(value * (end - start));
    const parseColor = (color:any) => color.match(/\w\w/g).map((hex:any) => parseInt(hex, 16));
  
    const startRGB = parseColor(startColor);
    const endRGB = parseColor(endColor);
  
    return Array.from({ length: steps }, (_, index) => {
      const t = index / (steps - 1);
      return `rgb(${colorMap(t, startRGB[0], endRGB[0])},${colorMap(t, startRGB[1], endRGB[1])},${colorMap(t, startRGB[2], endRGB[2])})`;
    });
  };

