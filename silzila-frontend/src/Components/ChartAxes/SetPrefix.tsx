// export const setPrefix = (fieldData, binName, chartType) => {
// 	if (!fieldData) {
// 		return fieldData;
// 	}

// 	let data = JSON.parse(JSON.stringify(fieldData));
// 	switch (data.dataType) {
// 		case "integer":
// 		case "decimal":
// 			if (binName === "Measure" || binName === "X" || binName === "Y") {
// 				data.agg = "sum";
// 			}
// 			break;

// 		case "text":
// 			if (binName === "Measure" || binName === "X" || binName === "Y") {
// 				data.agg = "count";
// 			}
// 			break;

// 		case "date":
// 		case "timestamp":
// 			// cause calendar chart works proper only with date
// 			if (chartType === "calendar") {
// 				if (binName === "Dimension") {
// 					data.time_grain = "date";
// 				} else {
// 					data.time_grain = "year";
// 					data.agg = "max";
// 				}
// 			}
// 			//
// 			else {
// 				if (binName === "Measure" || binName === "X" || binName === "Y") {
// 					data.time_grain = "year";
// 					data.agg = "max";
// 				} else if (binName === "Dimension") {
// 					data.time_grain = "year";
// 				} else {
// 					data.time_grain = "year";
// 				}
// 			}
// 			break;

// 		default:
// 			break;
// 	}
// 	return data;
// };
import React from "react";

const SetPrefix = () => {
	return <div>SetPrefix</div>;
};

export default SetPrefix;
