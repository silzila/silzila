import { SetPrefixFieldData } from "./ChartAxesInterfaces";

export const setDisplayName = (
	fieldData: SetPrefixFieldData,
	binName: string,
	chartType: string,
	geoLocation: string = "world"
) => {
	if (!fieldData) {
		return fieldData;
	}

	let data = JSON.parse(JSON.stringify(fieldData));

	if (data.isCalculatedField && data.isAggregated) {
		data.displayname = data.fieldname
		return data
	}

	switch (data.dataType.toLowerCase()) {
		case "integer":
		case "decimal":
			if (binName === "Measure" || binName === "X" || binName === "Y") {
				data.displayname = `${data.agg} of ${data.fieldname}`;
			}
			if (binName === "Location") {
				if (geoLocation === "world") data.agg = "name_long";
				else data.agg = "NAME_1";
			}
			break;

		case "text":
			if (binName === "Measure" || binName === "X" || binName === "Y") {
				data.displayname = `${data.agg} of ${data.fieldname}`;
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
					data.displayname = `${data.timeGrain} of ${data.fieldname}`;
				} else {
					data.displayname = `${data.agg} ${data.timeGrain} of ${data.fieldname}`;
				}
			}
			//
			else {
				if (binName === "Measure" || binName === "X" || binName === "Y") {
					data.displayname = `${data.agg} ${data.timeGrain} of ${data.fieldname}`;
				} else if (binName === "Dimension") {
					data.displayname = `${data.timeGrain} of ${data.fieldname}`;
				} else {
					data.displayname = `${data.timeGrain} of ${data.fieldname}`;
				}
			}
			break;

		default:
			break;
	}
	return data;
};
