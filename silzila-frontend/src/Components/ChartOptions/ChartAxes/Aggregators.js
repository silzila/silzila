const dimensionPrefixes = {
	integer: [],
	decimal: [],
	text: [],
	date: {
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Year Quarter", id: "yearquarter" },
			{ name: "Year Month", id: "yearmonth" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
	timestamp: {
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Year Quarter", id: "yearquarter" },
			{ name: "Year Month", id: "yearmonth" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
};

const measurePrefixes = {
	integer: [
		{ name: "Sum", id: "sum" },
		{ name: "Avg", id: "avg" },
		{ name: "Min", id: "min" },
		{ name: "Max", id: "max" },
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	decimal: [
		{ name: "Sum", id: "sum" },
		{ name: "Avg", id: "avg" },
		{ name: "Min", id: "min" },
		{ name: "Max", id: "max" },
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	text: [
		{ name: "Count", id: "count" },
		{ name: "Count Non Null", id: "countnn" },
		{ name: "Count Null", id: "countn" },
		{ name: "Count Unique", id: "countu" },
	],
	date: {
		aggr: [
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnn" },
			{ name: "Count Null", id: "countn" },
			{ name: "Count Unique", id: "countu" },
		],
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
	timestamp: {
		aggr: [
			{ name: "Min", id: "min" },
			{ name: "Max", id: "max" },
			{ name: "Count", id: "count" },
			{ name: "Count Non Null", id: "countnn" },
			{ name: "Count Null", id: "countn" },
			{ name: "Count Unique", id: "countu" },
		],
		time_grain: [
			{ name: "Year", id: "year" },
			{ name: "Quarter", id: "quarter" },
			{ name: "Month", id: "month" },
			{ name: "Date", id: "date" },
			{ name: "Day of Month", id: "dayofmonth" },
			{ name: "Day of Week", id: "dayofweek" },
		],
	},
};

const Aggregators = {
	Dimension: dimensionPrefixes,
	Row: dimensionPrefixes,
	Column: dimensionPrefixes,
	Measure: measurePrefixes,
	X: measurePrefixes,
	Y: measurePrefixes,
	Distribution: dimensionPrefixes,
};

export const AggregatorKeys = {
	sum: "Sum",
	avg: "Avg",
	min: "Min",
	max: "Max",
	count: "Count",
	countnn: "Count NN",
	countn: "Count Null",
	countu: "Count Unique",

	year: "Year",
	yearquarter: "Year Qtr",
	yearmonth: "Year Mth",
	month: "Month",
	quarter: "Quarter",
	dayofmonth: "Day Mn",
	dayofweek: "Day Wk",
	date: "Date",
};

export default Aggregators;
