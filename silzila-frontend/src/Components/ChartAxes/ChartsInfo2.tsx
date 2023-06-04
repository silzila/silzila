interface ChartsInfoProps {
	[key: string]: {
		dropZones: any[];
		showSwap: boolean;
	};
}
const ChartsInfo: ChartsInfoProps = {
	multibar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 10, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	stackedBar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	horizontalBar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 10, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	horizontalStacked: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	pie: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	donut: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	geoChart: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	line: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	area: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	stackedArea: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	scatterPlot: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "X", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
			{ name: "Y", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	gauge: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	heatmap: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Row", allowedNumbers: 1, min: 1, dataType: ["text", "string", "timestamp"] },
			{
				name: "Column",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},
	funnel: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 12, min: 2, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},

	// ============================================?
	// Future graph types

	"step line": {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 4, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: true,
	},

	rose: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},

	crossTab: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Row", allowedNumbers: 64, min: 0, dataType: ["text", "string", "timestamp"] },
			{
				name: "Column",
				allowedNumbers: 64,
				min: 0,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 64, min: 0, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	table: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Row", allowedNumbers: 64, min: 0, dataType: ["text", "string", "timestamp"] },
			{ name: "Measure", allowedNumbers: 64, min: 0, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},

	calendar: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Date", allowedNumbers: 1, min: 1, dataType: ["timestamp"] },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},

	bullet: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64 },
			{ name: "Dimension", allowedNumbers: 1 },
			{ name: "Measure", allowedNumbers: 4 },
		],
		showSwap: false,
	},

	boxPlot: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{
				name: "Distribution",
				allowedNumbers: 1,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	treeMap: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 4,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	sankey: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{
				name: "Dimension",
				allowedNumbers: 2,
				min: 1,
				dataType: ["text", "string", "timestamp"],
			},
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	richText: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	simplecard: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 1, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
	multirowcard: {
		dropZones: [
			{ name: "Filter", allowedNumbers: 64, min: 0 },
			{ name: "Measure", allowedNumbers: 12, min: 1, dataType: ["int", "float", "double"] },
		],
		showSwap: false,
	},
};

export default ChartsInfo;
