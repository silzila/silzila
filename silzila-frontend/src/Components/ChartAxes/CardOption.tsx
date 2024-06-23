import {
	MeasurePrefixes,
	WindowFunction,	
} from "./ChartAxesInterfaces";
import Aggregators from "./Aggregators";

const measurePrefixes: MeasurePrefixes = {
		integer: [
			{ name: "Window Function", id: "windowfn" },
		],
		decimal: [
			{ name: "Window Function", id: "windowfn" },
		],
		text: [
			{ name: "Window Function", id: "windowfn" },
		],
		date:  [
			{ name: "Window Function", id: "windowfn" },

		],
		timestamp:  [
			{ name: "Window Function", id: "windowfn" },
		],
	};
	
	const WindowFuction: WindowFunction = {
		Measure: measurePrefixes,
		X: measurePrefixes,
		Y: measurePrefixes,
	};

	
const overridePrefixes: any = {
	integer: [		
		{ name: "Override", id: "override" },
		{ name: "Disable Report Filter", id: "disableFilter" },
	],
	decimal: [		
		{ name: "Override", id: "override" },
		{ name: "Disable Report Filter", id: "disableFilter" },
	],
	text: [
		{ name: "Override", id: "override" },
		{ name: "Disable Report Filter", id: "disableFilter" },
	],
	date:  [		
		{ name: "Override", id: "override" },
		{ name: "Disable Report Filter", id: "disableFilter" },
	],
	timestamp:  [
		{ name: "Override", id: "override" },
		{ name: "Disable Report Filter", id: "disableFilter" },
	],
};

const OverrideFuction: any = {
	Measure: overridePrefixes,
	X: overridePrefixes,
	Y: overridePrefixes,
};


//function used to display aggregators and windowFunction based on axistitle and datatype
export const CardOption = (axisTitle: string, field: any) => {
    var aggr: any[] = [];
	var timegrain: any[] = [];
	var windowfn: any[] = [];
	let overRidefn: any[] = [];


	if (axisTitle === "Measure" || axisTitle === "X" || axisTitle === "Y") {
		if (field.dataType === "date" || field.dataType === "timestamp") {
			aggr= aggr.concat(Aggregators[axisTitle][field.dataType].aggr);
			timegrain = timegrain.concat(Aggregators[axisTitle][field.dataType].timeGrain);
			windowfn = windowfn.concat(WindowFuction[axisTitle][field.dataType]);
			overRidefn = overRidefn.concat(OverrideFuction[axisTitle][field.dataType]);

			return [aggr, timegrain, windowfn, overRidefn];
		} else {
			aggr = aggr.concat(Aggregators[axisTitle][field.dataType]);
			windowfn = windowfn.concat(WindowFuction[axisTitle][field.dataType]);
			overRidefn = overRidefn.concat(OverrideFuction[axisTitle][field.dataType]);
			return [aggr, timegrain, windowfn, overRidefn];
		}
	}

	if (
		axisTitle === "Dimension" ||
		axisTitle === "Row" ||
		axisTitle === "Column" ||
		axisTitle === "Distribution"
	) {
		if (field.dataType === "date" || field.dataType === "timestamp") {
			timegrain = timegrain.concat(Aggregators[axisTitle][field.dataType].timeGrain);
			return [aggr, timegrain, windowfn, overRidefn];
        } else {
			aggr = aggr.concat(Aggregators[axisTitle][field.dataType]);
			return [aggr, timegrain, windowfn, overRidefn];
		}
	} 

	
};
