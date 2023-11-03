export const delimiter = ",";

/*  To deep clone an Object */
export const cloneData = (data: any) => {
	return JSON.parse(JSON.stringify(data));
};

/*	Find and return field's new name	*/
const findFieldName = (name: string, fieldTempObject: any, i: number = 2): string => {
	if (fieldTempObject[`${name}(${i})`] !== undefined) {
		i++;
		return findFieldName(name, fieldTempObject, i);
	} else {
		return `${name}(${i})`;
	}
};

/*
    Get display data("JSON object") from fields with prefix
  */
export const getKeyWithPrefix = (item : any = {}, dustbinName? :string, fieldTempObject:any = {}) => {
  let _nameWithAgg: string =  "";

  if(dustbinName === "val"){
    if(item.dataType.toLowerCase() !== "date" && item.dataType.toLowerCase() !== "timestamp"){
      _nameWithAgg =	item.agg ? `${item.agg} of ${item.fieldname}`: item.fieldname;
    }
    else{
      let _timeGrain:string = item.timeGrain || "";
      _nameWithAgg = 	item.agg ? `${item.agg} ${_timeGrain} of ${item.fieldname}`: item.fieldname;
    }

 
    if(fieldTempObject[_nameWithAgg] !== undefined){
      _nameWithAgg = findFieldName(_nameWithAgg,fieldTempObject);
    }  
  }
  else{
    let _timeGrain:string = item.timeGrain || "";
    _nameWithAgg = 	_timeGrain ? `${_timeGrain} of ${item.fieldname}`: item.fieldname;
  }

  return _nameWithAgg;

  // if (dustbinName ==== "val") {
  //   //val ==> "Measure"
  //   switch (item.dataType) {
  //     case "date":
  //     case "timestamp":
  //       return `${item.fieldname}__${item.timeGrain}_${item.agg}`;
  //     case "decimal":
  //     case "integer":
  //       return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
  //     case "text":
  //       return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
  //     default:
  //       return item?.fieldname || "";
  //   }
  // } else {  // col/row ==> Columns / Rows
  //   switch (item.dataType) {
  //     case "date":
  //     case "timestamp":
  //       return `${item.fieldname}__${item.agg ? item.agg : item.timeGrain}`;
  //     case "decimal":
  //     case "integer":
  //       return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
  //     case "text":
  //       return `${item.fieldname}${item.agg ? "__" + item.agg : ""}`;
  //     default:
  //       return item?.fieldname || "";
  //   }
  // }
};

/*
    Get particular distinct list for given index from split of chartDataCSV.columns using the delimiter
  */

export const getColumnList = (index: number, list: any[]) => {
	////let chartColumns = chartDataCSV.columns.sort();  ::TODO
	let chartColumns = list;
	let _columnList: any[] = [];

	for (let i = 0; i < chartColumns.length; i++) {
		let _tempColString = "";

		if (chartColumns[i].includes(delimiter)) {
			_tempColString = chartColumns[i].substring(
				0,
				chartColumns[i].length - delimiter.length
			);
		}

		let col = _tempColString.split(delimiter)[index];

		if (!_columnList.includes(col)) {
			_columnList.push(col);
		}
	}
	return _columnList;
};

/*
    Filter items from ChartData / given list for given compare Object
  */

export const getFilteredChartPropDataByCompareObject = (propData:any, compareObj:any, data?:any) => {
  const finder = (item:any) => {
    let keys = Object.keys(compareObj);
    let isEqual = true;

    if (keys && keys.length > 0) {
      keys.forEach((key) => {
        if (isEqual) isEqual = item[key]?.toString() === compareObj[key]?.toString();
      });

      return isEqual;
    } else {
      return true;
    }
  };

  if (data) {
    return data.filter((item:any) => finder(item));
  } else {
    return propData.filter((item:any) => finder(item));
  }
};

/*
    To construct DusbinColumn column list, need to fiter distinct collection based on the dusbin coulmn field with chart data value.
     From parent compare object need to add additional key : value to filter for next/child column header
  */

export const getDistinctList = (
	dustbinColumns: any,
	compareObj: any,
	columnIndex: number,
	list: any[]
) => {
	list = list || [];
	let resultList: any[] = [];

	const finder = (item: any, modifiedCompareObj: any) => {
		let keys = Object.keys(modifiedCompareObj);
		let isEqual = true;

    keys.forEach((key) => {
      if (isEqual) isEqual = item[key] === modifiedCompareObj[key];
    });


		return isEqual;
	};

	list.forEach(item => {
		let modifiedCompareObj = Object.assign({}, compareObj);
		let _key = getKeyWithPrefix(dustbinColumns[columnIndex]);
		modifiedCompareObj[_key] = item[_key];

    let distinctObj = list.find((item) => finder(item, modifiedCompareObj));

    if (resultList.length === 0 || !resultList.find((item) => finder(item, modifiedCompareObj))) {
      resultList.push(distinctObj);
    }
  });


	return resultList;
};

/*  TODO:: Feature to change color of Row/Column cells on header cell click */

export const getUserClickedClassNameForColor = (
	chartPropData: any,
	col: any,
	userCellCompareJSON: any
) => {
	let _className = "UserClickedCellRemainingChildren";

	let _filteredData = getFilteredChartPropDataByCompareObject(chartPropData, userCellCompareJSON);

	if (Object.keys(col.compareObj).length > 0) {
		let _currentData = getFilteredChartPropDataByCompareObject(
			chartPropData,
			col.compareObj,
			_filteredData
		);

		if (_currentData.length > 0) {
			_className = "UserClickedCellChildren";
		}
	}

	return _className;
};

/*
    For row span, need to compare with previous cell display value
*/

export const getPreviousRowColumnData = (
	crossTabData: any,
	dustbinColumns: any,
	dustbinValues: any,
	showAsColumn: any,
	rowIndex: any,
	colIndex: any,
	dontIncrement?: any
): any => {
	let headerRowCount = dustbinColumns.length;
	let rowNumber = headerRowCount + rowIndex;

	if (rowNumber >= 0) {
		let colData = crossTabData[rowNumber]?.columnItems[colIndex];

		if (colData && colData.displayData === "" && rowIndex !== 0) {
			return getPreviousRowColumnData(
				crossTabData,
				dustbinColumns,
				dustbinValues,
				showAsColumn,
				rowIndex - 1,
				colIndex
			);
		} else {
			return colData;
		}
	} else {
		return "";
	}
};

/*
    Push Dusbin Values into ChartData rows/column collection
*/
export const addDusbinValuesMeasuresInChartData = (dustbinValues: any, list: any) => {
	let newRowsArray = [];

	if (dustbinValues.length > 1) {
		for (let i = 0; i < list.length; i++) {
			for (let valIndex = 0; valIndex < dustbinValues.length; valIndex++) {
				newRowsArray.push(
					list[i].concat(getKeyWithPrefix(dustbinValues[valIndex]), delimiter)
				);
			}
		}
		return newRowsArray;
	}
};
