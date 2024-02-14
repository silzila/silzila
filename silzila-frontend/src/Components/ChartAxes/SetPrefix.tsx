import { SetPrefixFieldData } from "./ChartAxesInterfaces";

export const setPrefix = (
	fieldData: SetPrefixFieldData,
	binName: string,
	chartType: string,
	geoLocation: string = "world"
) => {
	if (!fieldData) {
		return fieldData;
	}

	let data = JSON.parse(JSON.stringify(fieldData));
	switch (data.dataType.toLowerCase()) {
		case "integer":
		case "decimal":
			if (binName === "Measure" || binName === "X" || binName === "Y") {
				data.agg = "sum";
			}
			if (binName === "Location") {
				if (geoLocation === "world") data.agg = "name_long";
				else data.agg = "NAME_1";
			}
			break;

		case "text":
			if (binName === "Measure" || binName === "X" || binName === "Y") {
				data.agg = "count";
			}
			if (binName === "Location") {
				if (geoLocation === "world") data.agg = "name_long";
				else data.agg = "NAME_1";
			}
			break;

		case "date":
		case "timestamp":
			// cause calendar chart works proper only with date
			if (chartType === "calendar") {
				// if (binName === "Dimension") {
				if (binName === "Date") {
					data.timeGrain = "date";
				} else {
					data.timeGrain = "year";
					data.agg = "max";
				}
			}
			//
			else {
				if (binName === "Measure" || binName === "X" || binName === "Y") {
					data.timeGrain = "year";
					data.agg = "max";
				} else if (binName === "Dimension") {
					data.timeGrain = "year";
				} else {
					data.timeGrain = "year";
				}
			}
			break;

		default:
			break;
	}
	return data;
};
