import FetchData from "../ServerCall/FetchData";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { IFilter } from "../DataSet/BottomBarInterfaces";

export const isNameAllowed = (name: string): boolean => /^[a-zA-Z0-9 _-]+$/.test(name);

export const GetWorkSpaceDetails = (
  workSpaceList: any,
  workSpaceId: string,
  isSubWorkSpace: boolean = false
) => {
  if (isSubWorkSpace) {
    let parentWorkspace: any = null;
    let current: any = null;

    [...workSpaceList].forEach((item: any) => {
      if (!current) {
        current = item.children.find(
          (subItem: any) => subItem.id === workSpaceId
        );

        if (current) {
          parentWorkspace = item;
          return;
        }
      }
    });

    return {
      label: parentWorkspace.label,
      subLabel: current.label,
    };
  } else {
    return workSpaceList.find((item: any) => item.id === workSpaceId);
  }
};

export const DeleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

};

export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    return;
  }
  const regexForIntegerNumbers = /^[0-9]$/

  if (!regexForIntegerNumbers.test(event.key)) {
    event.preventDefault();
  }
};

export const ConvertListOfListToRichTreeViewList = (list: any) => {
  let treeView: any = [];

  list.forEach((woskspaces: any) => {
    let item: any = {
      id: woskspaces.workspaceId,
      label: woskspaces.workspaceName,
      children: [],
    };

    woskspaces.subWorkspaces.forEach((subWorkSpaces: any) => {
      let innerItem = {
        id: subWorkSpaces.workspaceId,
        label: subWorkSpaces.workspaceName,
      };

      item.children.push(innerItem);
    });

    treeView.push(item);
  });

  return treeView;
};

export const ConvertListOfListToDataConnectionRichTreeViewList = (
  list: any,
  icon: string = "dbcon"
) => {
  let treeView: any = [];

  list.forEach((woskspaces: any) => {
    let item: any = {
      id: woskspaces.workspaceId,
      label: woskspaces.workspaceName,
      children: [],
    };

    woskspaces.subWorkspaces.forEach((subWorkSpace: any) => {
      let innerItem: any = {
        id: subWorkSpace.workspaceId,
        label: subWorkSpace.workspaceName,
        children: [],
      };

      subWorkSpace.contents.forEach((dbCon: any) => {
        let itemWithNoChildren = {
          id: dbCon.id,
          label: dbCon.name,
          fileType: icon,
        };

        innerItem.children.push(itemWithNoChildren);
      });

      item.children.push(innerItem);
    });

    woskspaces.contents.forEach((dbCon: any) => {
      let itemWithNoChildren: any = {
        id: dbCon.id,
        label: dbCon.name,
        fileType: icon,
      };

      item.children.push(itemWithNoChildren);
    });

    if (item.children.length === 0) {
      delete item.children;
    }

    treeView.push(item);
  });

  return treeView;
};

export const flattenList = (list: any, workSpaceId: string = "") => {
  return list.reduce((acc: any, item: any) => {
    if (Array.isArray(item.children)) {
      // Recursively flatten nested arrays
      return acc.concat(flattenList(item.children, item.id));
    } else {
      item.workSpaceId = workSpaceId;
      return acc.concat(item);
    }
  }, []);
};

export const validateEmail = (email: string) => {
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var result = res.test(String(email).toLowerCase());
  return result;
};

export const validateMandatory = (value: string) => {
  if (value) {
    return value.length >= 1 ? true : false;
  } else {
    return false;
  }
};

export const validatePassword = (password: string) => {
  // return password.length >= 8 ? true : false;
  // TODO: need to change 4 to 6 after testing
  return password.length >= 4 ? true : false;
};

export const validateEqualValues = (value1: string, value2: string) => {
  return value1 === value2;
};

export const interpolateColor = (
  startColor: any,
  endColor: any,
  steps: any
) => {
  const colorMap = (value: any, start: any, end: any) =>
    start + Math.round(value * (end - start));
  const parseColor = (color: any) =>
    color?.match(/\w\w/g)?.map((hex: any) => parseInt(hex, 16));

  const startRGB = parseColor(startColor);
  const endRGB = parseColor(endColor);

  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1);
    return `rgb(${colorMap(t, startRGB[0], endRGB[0])},${colorMap(
      t,
      startRGB[1],
      endRGB[1]
    )},${colorMap(t, startRGB[2], endRGB[2])})`;
  });
};

export const generateRandomColorArray = (length: number) => {
  const colorArray = [];

  for (let i = 0; i < length; i++) {
    colorArray.push(_getRandomcolor());
  }

  return colorArray;
};

const _getRandomcolor = (): any => {
  let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  if (isValidColor(randomColor)) {
    return randomColor;
  } else {
    return _getRandomcolor();
  }
};

const getRelativeLuminance = (color: any) => {
  let r, g, b, a;

  const rgbaRegex = /rgba\(\d+,\d+,\d+,\d+(\.\d+)?\)/;

  // Find the first match
  const match = color.match(rgbaRegex);

  if (match) {
    // Extract the components
    const rgbaParts = color.match(/\d+(\.\d+)?/g); // Matches numbers
    [r, g, b, a] = rgbaParts?.map(Number);
  } else {
    let rgb = parseInt(color.slice(1), 16); // Convert hex to decimal
    r = (rgb >> 16) & 0xff;
    g = (rgb >> 8) & 0xff;
    b = (rgb >> 0) & 0xff;
  }

  const sRGB = [r / 255, g / 255, b / 255];
  const sRGBTransform = sRGB.map((val) => {
    if (val <= 0.04045) {
      return val / 12.92;
    } else {
      return Math.pow((val + 0.055) / 1.055, 2.4);
    }
  });

  return (
    0.2126 * sRGBTransform[0] +
    0.7152 * sRGBTransform[1] +
    0.0722 * sRGBTransform[2]
  );
};

export const getContrastColor = (backgroundColor: string) => {
  // Function to calculate relative luminance

  // Calculate the relative luminance of the background color
  const bgLuminance: any = getRelativeLuminance(backgroundColor);

  // Determine the contrast ratio
  const contrast = (bgLuminance + 0.05) / 0.05; // Add 0.05 to avoid division by zero

  // Choose black or white based on the contrast ratio
  //return contrast > 4.5 ? '#000000' : '#ffffff';
  return contrast > 4.3 ? "#000000" : "#ffffff";
};

const isValidColor = (color: any) => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

const _changeJSONObjectOrder = (orderedArray: any, item: any) => {
  const entries = Object.entries(item);

  entries.sort(([keyA], [keyB]) => {
    return orderedArray.indexOf(keyA) - orderedArray.indexOf(keyB);
  });

  return Object.fromEntries(entries);
};

export const changeChartDataToAxesOrder = (
  chartData: any,
  chartProp: any,
  propKey: string
) => {
  let fields: any = [];
  let fieldsNames: string[] = [];
  let orderedChartData: any = [];

  switch (chartProp.properties[propKey].chartType) {
    case "pie":
    case "rose":
    case "donut":
    case "line":
    case "area":
    case "step line":
    case "stackedArea":
    case "multibar":
    case "stackedBar":
    case "horizontalStacked":
    case "horizontalBar":
      fields = chartProp.properties[propKey].chartAxes[1].fields;
      fields = [
        ...fields,
        ...chartProp.properties[propKey].chartAxes[2].fields,
      ];
      break;
  }

  if (fields && fields.length > 0) {
    for (let field of fields) {
      fieldsNames.push(fieldName(field));
    }

    chartData.forEach((data: any) => {
      orderedChartData.push(_changeJSONObjectOrder(fieldsNames, data));
    });

    return orderedChartData;
  } else {
    return chartData;
  }
};

export const getLabelValues = async (
  columnName: string,
  chartControls: any,
  chartProperties: any,
  propKey: string,
  token: string
) => {
  try {
    let fieldValues: any = [];
    let field: any = {};

    var chartThemes: any[];
    var chartControl: any = chartControls.properties[propKey];

    chartThemes = ColorSchemes.filter((el) => {
      return el.name === chartControl.colorScheme;
    });

    // checking the column type To generate the name as it is in the chartData
    // chartProperties.properties[propKey].chartAxes[1].fields.forEach(async (el: any) => {
    // 	//if (el.dataType === "date") {
    // 	;
    // 	if (columnName.includes(el.fieldname)) {
    // 		//formattedColumnName = `${el.timeGrain} of ${el.fieldname}`;
    // 		if(["date", "timestamp"].includes(el.dataType)){
    // 			if(columnName.split(' of ')[0] === el.timeGrain){
    // 				field = el;
    // 				return;
    // 			}
    // 		}
    // 		else{
    // 			field = el;
    // 			return;
    // 		}
    // 	}
    // 	//}
    // });

    // checking the column type To generate the name as it is in the chartData
    chartProperties.properties[propKey].chartAxes[1].fields.forEach(
      async (el: any) => {
        //if (el.dataType === "date") {

        // if (columnName.includes(el.fieldname)) {
        if (columnName === el.displayname) {
          //formattedColumnName = `${el.timeGrain} of ${el.fieldname}`;
          if (["date", "timestamp"].includes(el.dataType)) {
            // if (columnName.split(" of ")[0] === el.timeGrain) {
            field = el;
            return;
            // }
          } else {
            field = el;
            return;
          }
        }
        //}
      }
    );

    let formattedColumnName = ["date", "timestamp"].includes(field.dataType)
      ? field.timeGrain
      : columnName;
    fieldValues = await fetchFieldData(field, chartProperties, propKey, token);
    formattedColumnName = Object.keys(fieldValues?.data?.[0]).find(
      (key) => key.toLowerCase() === formattedColumnName.toLowerCase()
    );

    //let colors = interpolateColor("#2BB9BB", "#D87A80", fieldValues?.data?.length);
    let length =
      chartThemes[0].colors.length > fieldValues?.data?.length
        ? chartThemes[0].colors.length - fieldValues?.data?.length
        : fieldValues?.data?.length - chartThemes[0].colors.length;

    let randomColors = generateRandomColorArray(length);
    let colors = chartThemes[0].colors;

    colors = [...colors, ...randomColors];

    const values = fieldValues?.data?.map((item: any, idx: number) => {

      return {
        colValue: item[formattedColumnName],
        backgroundColor: colors[idx],
        isBold: false,
        isItalic: false,
        isUnderlined: false,
        fontColor: getContrastColor(colors[idx]),
      };
    });

    return values;
  } catch (err) {
    console.error(err);
  }
};

const _findFieldName = (
  name: string,
  i: number = 2,
  _fieldTempObject: any
): string => {
  if (_fieldTempObject[`${name}(${i})`] !== undefined) {
    i++;
    return _findFieldName(name, i, _fieldTempObject);
  } else {
    return `${name}(${i})`;
  }
};

export const FindFieldName = (name: string, i: number = 2): string => {
  let _fieldTempObject: any = {};

  return _findFieldName(name, i, _fieldTempObject);
};

export const fieldName = (field: any) => {
  if (field) {
    if (field.agg || field.timeGrain) {
      if (["date", "timestamp"].includes(field.dataType)) {
        return `${field.timeGrain} of ${field.fieldname}`;
      } else {
        return `${field.agg} of ${field.fieldname}`;
      }
    } else {
      return field.fieldname;
    }
  } else {
    return field;
  }
};

export const displayName = (field: any) => {
  if (field) {
    return field.displayname;
  }
  return field;
};

export const findNewDisplayName = (
  chartAxes: any,
  paramField: any,
  allowedNumbers: number
): any => {
  let _measureZone: any = chartAxes.find(
    (zones: any) => zones.name === "Measure"
  );

  let _fieldTempObject: any = {};

  /*	Find and return field's new name	*/
  const findFieldName = (name: string, i: number = 0): string => {
    if (
      (i === 0 && _fieldTempObject[name] !== undefined) ||
      _fieldTempObject[`${name}(${i})`] !== undefined
    ) {
      i = i === 0 ? 1 : i;

      i++;
      return findFieldName(name, i);
    } else {
      if (i === 0) {
        return name;
      } else {
        return `${name}(${i})`;
      }
    }
  };

  if (allowedNumbers === _measureZone?.fields.length) {
    return paramField.displayname;
  }

  _measureZone?.fields.forEach((field: any, index: number) => {
    let _nameWithAgg: string = "";
    let _tempField = JSON.parse(JSON.stringify(field));

    _nameWithAgg = _tempField.displayname;

    if (_fieldTempObject[_nameWithAgg] !== undefined) {
      let _name = findFieldName(_nameWithAgg);
      _tempField["NameWithAgg"] = _name;
      _fieldTempObject[_name] = "";
    } else {
      _tempField["NameWithAgg"] = _nameWithAgg;
      _fieldTempObject[_nameWithAgg] = "";
    }
  });

  let newName = findFieldName(paramField.displayname);

  return newName || paramField.displayname;
};

const fetchFieldData = (
  bodyData: any,
  chartProperties: any,
  propKey: string,
  token: string
) => {
  //  bodyData: any = {
  // 	tableId: tableId,
  // 	fieldName: displayname,
  // 	dataType: dataType,
  // 	filterOption: "allValues",
  // };
  if (bodyData.dataType === "timestamp" || bodyData.dataType === "date") {
    bodyData["timeGrain"] = bodyData.timeGrain || "year";
  }

  bodyData.filterOption = "allValues";
  bodyData.fieldName = bodyData.fieldname;
  // bodyData.displayName = bodyData.displayname

  return FetchData({
    requestType: "withData",
    method: "POST",
    url: `filter-options?dbconnectionid=${chartProperties.properties[propKey].selectedDs.connectionId}&datasetid=${chartProperties.properties[propKey].selectedDs.id}&workspaceId=${chartProperties.properties[propKey].selectedDs.workSpaceId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: bodyData,
  });
};

export const modifyFilter = (filter: any, savedCalculations?: any[]): IFilter => {
  const getCalculationByUid = (uid: string, savedCalculations?: any[]) => {
    if (!uid || !savedCalculations) return null;
    return savedCalculations.find((calculation) => calculation.uuid === uid);

  }
  const calculation = getCalculationByUid(filter.SavedCalculationUUID, savedCalculations);
  const calculationDetails = {
    calculatedField: [calculation?.calculationInfo],
    isCalculatedField: true
  }
  if (filter.fieldtypeoption === "Pick List") {
    return {
      filterType: "pickList",
      tableId: filter.tableId,
      uid: filter.uId,
      dataType: filter.dataType,
      fieldName: filter.fieldname,
      shouldExclude:
        filter.includeexclude.toLowerCase() === "exclude" ? true : false,
      operator: "in",
      tableName: "",
      isTillDate: filter.exprTypeTillDate ?? false,
      userSelection: filter.userSelection.filter((el: any) => el !== "(All)"),
      ...(filter.dataType === "date" || filter.dataType === "timestamp"
        ? { timeGrain: filter.prefix }
        : {}),
      ...((filter.isCalculatedField && calculation) ? { ...calculationDetails } : {})
    };
  } else if (filter.fieldtypeoption === "Search Condition") {
    return {
      filterType: "searchCondition",
      tableId: filter.tableId,
      tableName: "",
      uid: filter.uId,
      isTillDate: filter.exprTypeTillDate ?? false,
      dataType: filter.dataType,
      fieldName: filter.fieldname,
      operator: filter.exprType,
      shouldExclude:
        filter.includeexclude.toLowerCase() === "exclude" ? true : false,
      userSelection:
        filter.exprType === "between"
          ? [filter.greaterThanOrEqualTo, filter.lessThanOrEqualTo]
          : [filter.exprInput],
      ...(filter.dataType === "date" || filter.dataType === "timestamp"
        ? { timeGrain: filter.prefix }
        : {}),
      ...((filter.isCalculatedField && calculation) ? { ...calculationDetails } : {})
    };
  } else {
    // return {}
    return {
      filterType: "relativeFilter",
      tableId: filter.tableId,
      uid: filter.uId,
      dataType: filter.dataType,
      fieldName: filter.fieldname,
      shouldExclude:
        filter.includeexclude.toLowerCase() === "exclude" ? true : false,
      operator: "between",
      tableName: "",
      isTillDate: filter.exprTypeTillDate ?? false,
      timeGrain: "date",
      userSelection: [],
      relativeCondition: {
        from: [
          filter.expTypeFromRelativeDate,
          filter.exprInputFromValueType,
          filter.expTypeFromdate,
        ],
        to: [
          filter.expTypeToRelativeDate,
          filter.exprInputToValueType,
          filter.expTypeFromdate,
        ],
        anchorDate:
          filter.expTypeAnchorDate !== "today"
            ? filter.expTypeAnchorDate
            : filter.expTypeAnchorDate,
      },
      ...((filter.isCalculatedField && calculation) ? { ...calculationDetails } : {})
    };
  }
};

const dataTypeMap: { [key: string]: string[] } = {
  number: [
    "INT",
    "INTEGER",
    "BIGINT",
    "SMALLINT",
    "TINYINT",
    "FLOAT",
    "REAL",
    "DOUBLE",
    "DECIMAL",
    "NUMERIC",
    "DOUBLE PRECISION",
  ],
  text: ["CHAR", "VARCHAR", "TEXT", "STRING"],
  date: ["DATE", "DATETIME", "TIMESTAMP"],
  boolean: ["BOOLEAN", "BOOL"],
  // Add more mappings if necessary
};

// Helper function to find the canonical type for a given data type
function getCanonicalType(type: string): string | null {
  for (const [canonicalType, typeList] of Object.entries(dataTypeMap)) {
    if (typeList.includes(type.toUpperCase())) {
      return canonicalType;
    }
  }
  return null; // Return null if type is not found
}

// Main function to compare two types
export function isSimilarDataType(
  selectedType: string,
  comparingType: string
): boolean {
  const selectedCanonicalType = getCanonicalType(selectedType);
  const comparingCanonicalType = getCanonicalType(comparingType);

  if (selectedCanonicalType && comparingCanonicalType) {
    return selectedCanonicalType === comparingCanonicalType;
  }

  return false; // Return false if one or both types are not recognized
}

/**
 *
 * @param value
 * @returns the sql data type of the value
 */
export function getSQLDataType(value: any) {
  if (value === null) return "null";

  switch (typeof value) {
    case "string":
      return "text";
    case "number":
      // Check for integers and floating-point numbers
      return Number.isInteger(value) ? "integer" : "decimal";
    case "boolean":
      return "boolean";
    case "object":
      if (Array.isArray(value)) return "text"; // Arrays often stored as TEXT or JSON
      if (value instanceof Date) return "datetime"; // Date objects often stored as DATETIME
      if (value instanceof Buffer) return "blob"; // Binary data like images/files
      return "JSON"; // Objects often stored as JSON in SQL databases
    default:
      return "text"; // Default fallback for unsupported types
  }
}

export function areNestedObjectsEqual(obj1Str: string, obj2Str: string): boolean {
  try {
    // Parse the JSON strings into objects
    const obj1 = JSON.parse(obj1Str);
    const obj2 = JSON.parse(obj2Str);

    function deepCompare(obj1: any, obj2: any): boolean {
      if (typeof obj1 !== typeof obj2) return false;

      if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {

        return obj1 === obj2; // Primitive or null comparison
      }

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepCompare(obj1[key], obj2[key])) return false;
      }

      return true;
    }

    return deepCompare(obj1, obj2);
  } catch (error) {
    return false; // Return false if the input strings are not valid JSON
  }
}
export function deletePlaybookDetailsFromSessionStorage() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith("pb_id_")) {
      sessionStorage.removeItem(key);
      i--;
    }
  }
}

