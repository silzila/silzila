// export const delimiter = ",";

// /*  To deep clone an Object */
// export const cloneData = (data) => {
//   return JSON.parse(JSON.stringify(data));
// };

// /*
//     Get display data("JSON object") from fields with prefix
//   */
// export const getKeyWithPrefix = (item, dustbinName) => {
//   if (dustbinName == "val") {
//     //val ==> "Measure"
//     switch (item.dataType) {
//       case "date":
//       case "timestamp":
//         return `${item.fieldname}__${item.time_grain}_${item.agg}`;
//       case "decimal":
//       case "integer":
//         return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
//       case "text":
//         return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
//       default:
//         return item?.fieldname || "";
//     }
//   } else {  // col/row ==> Columns / Rows
//     switch (item.dataType) {
//       case "date":
//       case "timestamp":
//         return `${item.fieldname}__${item.agg ? item.agg : item.time_grain}`;
//       case "decimal":
//       case "integer":
//         return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
//       case "text":
//         return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
//       default:
//         return item?.fieldname || "";
//     }
//   }
// };

// /*
//     Get particular distinct list for given index from split of chartDataCSV.columns using the delimiter
//   */

// export const getColumnList = (index, list) => {
//   ////let chartColumns = chartDataCSV.columns.sort();  ::TODO
//   let chartColumns = list;
//   let _columnList = [];

//   for (let i = 0; i < chartColumns.length; i++) {
//     let _tempColString = "";

//     if (chartColumns[i].includes(delimiter)) {
//       _tempColString = chartColumns[i].substring(0, chartColumns[i].length - delimiter.length);
//     }

//     let col = _tempColString.split(delimiter)[index];

//     if (!_columnList.includes(col)) {
//       _columnList.push(col);
//     }
//   }
//   return _columnList;
// };

// /*
//     Filter items from ChartData / given list for given compare Object
//   */

// export const getFilteredChartPropDataByCompareObject = (propData, compareObj, data) => {
//   const finder = (item) => {
//     let keys = Object.keys(compareObj);
//     let isEqual = true;

//     if (keys && keys.length > 0) {
//       keys.forEach((key) => {
//         if (isEqual) isEqual = item[key] == compareObj[key];
//       });

//       return isEqual;
//     } else {
//       return true;
//     }
//   };

//   if (data) {
//     return data.filter((item) => finder(item));
//   } else {
//     return propData.filter((item) => finder(item));
//   }
// };

// /*
//     To construct DusbinColumn column list, need to fiter distinct collection based on the dusbin coulmn field with chart data value.
//      From parent compare object need to add additional key : value to filter for next/child column header
//   */

// export const getDistinctList = (dustbinColumns, compareObj, columnIndex, list) => {
//   list = list || [];
//   let resultList = [];

//   const finder = (item, modifiedCompareObj) => {
//     let keys = Object.keys(modifiedCompareObj);
//     let isEqual = true;

//     keys.forEach((key) => {
//       if (isEqual) isEqual = item[key] == modifiedCompareObj[key];
//     });

//     return isEqual;
//   };

//   list.forEach((item) => {
//     let modifiedCompareObj = Object.assign({}, compareObj);
//     let _key = getKeyWithPrefix(dustbinColumns[columnIndex]);
//     modifiedCompareObj[_key] = item[_key];

//     let distinctObj = list.find((item) => finder(item, modifiedCompareObj));

//     if (resultList.length == 0 || !resultList.find((item) => finder(item, modifiedCompareObj))) {
//       resultList.push(distinctObj);
//     }
//   });

//   return resultList;
// };

//   /*  TODO:: Feature to change color of Row/Column cells on header cell click */

// export const getUserClickedClassNameForColor = (chartPropData, col, userCellCompareJSON) => {
//   let _className = "UserClickedCellRemainingChildren";

//   let _filteredData = getFilteredChartPropDataByCompareObject(chartPropData, userCellCompareJSON);

//   if (Object.keys(col.compareObj).length > 0) {
//     let _currentData = getFilteredChartPropDataByCompareObject(
//       chartPropData,
//       col.compareObj,
//       _filteredData
//     );

//     if (_currentData.length > 0) {
//       _className = "UserClickedCellChildren";
//     }
//   }

//   return _className;
// };

// /*
//     For row span, need to compare with previous cell display value
// */

// export const getPreviousRowColumnData = (
//   crossTabData,
//   dustbinColumns,
//   dustbinValues,
//   showAsColumn,
//   rowIndex,
//   colIndex,
//   dontIncrement
// ) => {
//   let headerRowCount = dustbinColumns.length;
//   let rowNumber = headerRowCount + rowIndex;

//   if (rowNumber >= 0) {
//     let colData = crossTabData[rowNumber]?.columnItems[colIndex];

//     if (colData && colData.displayData === "" && rowIndex !== 0) {
//       return getPreviousRowColumnData(
//         crossTabData,
//         dustbinColumns,
//         dustbinValues,
//         showAsColumn,
//         rowIndex - 1,
//         colIndex
//       );
//     } else {
//       return colData;
//     }
//   } else {
//     return "";
//   }
// };

// /*
//     Push Dusbin Values into ChartData rows/column collection
// */
// export const addDusbinValuesMeasuresInChartData = (dustbinValues, list) => {
//   let newRowsArray = [];

//   if (dustbinValues.length > 1) {
//     for (let i = 0; i < list.length; i++) {
//       for (let valIndex = 0; valIndex < dustbinValues.length; valIndex++) {
//         newRowsArray.push(list[i].concat(getKeyWithPrefix(dustbinValues[valIndex]), delimiter));
//       }
//     }
//     return newRowsArray;
//   }
// };
import React from "react";

const CrossTab = () => {
	return <div>CrossTab</div>;
};

export default CrossTab;
