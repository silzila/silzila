import { ChartControlsProps } from "./ChartControlsInterface";

export const updateChartData = (propKey: string | number, chartData: string) => {
	return {
		type: "UPDATE_CHART_DATA",
		payload: { propKey, chartData },
	};
};

export const setColorScheme = (propKey: string | number, color: string) => {
	return { type: "CHANGE_COLOR_SCHEME", payload: { propKey, color } };
};

export const setAreaColorOptions = (
	propKey: number | string,
	option: string,
	value: string | number
) => {
	return { type: "AREA_COLOR_OPTIONS", payload: { propKey, option, value } };
};

export const addControl = (tabId: number, nextTileId: number, newTab: boolean) => {
	if (newTab) {
		return {
			type: "ADD_NEW_CONTROL_FROM_TAB",
			payload: { tabId, tileId: nextTileId, newTab },
		};
	} else {
		return {
			type: "ADD_NEW_CONTROL",
			payload: {
				tabId: tabId,
				tileId: nextTileId,
			},
		};
	}
};

export const duplicateControl = (propKey: string | number, chartControl: ChartControlsProps) => {
	console.log(propKey, chartControl);
	return { type: "DUPLICATE_CHART_CONTROL", payload: { propKey, chartControl } };
};

export const removeChartControls = (
	tabId: number | string,
	tileId: number | string,
	propKey: number | string,
	tileIndex: number | string
) => {
	return { type: "DELETE_CONTROLS", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultipleChartControls = (tabId: number) => {
	return { type: "DELETE_CONTROLS_OF_TAB", payload: tabId };
};

// ===================================
// Color Scale
export const setColorScaleOption = (
	option: string,
	value: string | number,
	propKey: number | string
) => {
	return {
		type: "SET_COLOR_SCALE_OPTION",
		payload: { option: option, value: value, propKey: propKey },
	};
};

export const addingNewStep = (
	propkey: string | number,
	index: string | number,
	value: number | string
) => {
	return {
		type: "ADDING_NEW_STEP",
		payload: { propKey: propkey, index: index, value: value },
	};
};

export const changingValuesofSteps = (propkey: number | string, value: number | string) => {
	return {
		type: "CHANGING_VALUES_OF_STEPS",
		payload: { propKey: propkey, value: value },
	};
};

export const switchAutotoManualinSteps = (propkey: string | number, value: string | number) => {
	return {
		type: "SWITCH_STEPS_AUTO_MANUAL",
		payload: { propKey: propkey, value: value },
	};
};
// ===================================
// Labels

export const updateCrossTabStyleOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_STYLE_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateCrossTabHeaderLabelOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_HEADER_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateCrossTabCellLabelOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_CELL_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateLabelOption = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateLabelPosition = (propKey: string | number, value: string | number) => {
	return {
		type: "UPDATE_LABEL_POSITION",
		payload: { propKey: propKey, value: value },
	};
};
export const updateLabelPadding = (propKey: string | number, value: string | number) => {
	return {
		type: "UPDATE_LABEL_PADDING",
		payload: { propKey: propKey, value: value },
	};
};

// ===================================
// Format

export const updateFormatOption = (
	propKey: string | number,
	formatType: any,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_FORMAT_OPTIONS",
		payload: { propKey, formatType, option, value },
	};
};

// ==============================
// Legend

export const updateLegendOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_LEGEND_OPTIONS", payload: { propKey, option, value } };
};

export const resetLegendOptions = (
	propKey: string | number,
	marginValues: any,
	legendValues: any
) => {
	return { type: "RESET_LEGEND_OPTIONS", payload: { propKey, marginValues, legendValues } };
};

// ==============================
// Margin

export const updateChartMargins = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_CHART_MARGINS", payload: { propKey, option, value } };
};

export const setSelectedMargin = (propKey: string | number, margin: any) => {
	return { type: "SELECTED_MARGIN", payload: { propKey, margin } };
};

// ==============================
// MouseOver

export const enableMouseOver = (propKey: string | number, enable: any) => {
	return { type: "ENABLE_MOUSE_OVER", payload: { propKey, enable } };
};

// ==============================
// Grid & Axis

export const enableGrid = (propKey: string | number, value: string | number, show: any) => {
	return { type: "ENABLE_GRID", payload: { propKey, value, show } };
};

export const updateAxisMinMax = (propKey: string | number, axisKey: any, axisValue: any) => {
	return { type: "AXIS_MIN_MAX", payload: { propKey, axisKey, axisValue } };
};
export const updateAxisMinMaxforScatter = (
	propKey: string | number,
	axisKey: any,
	axisValue: any
) => {
	return { type: "AXIS_MIN_MAX_FOR_SCATTER", payload: { propKey, axisKey, axisValue } };
};

export const loadChartControls = (chartControls: any) => {
	return { type: "LOAD_CHART_CONTROLS", payload: chartControls };
};

// ==============================
// Reset state

export const resetChartControls = () => {
	return { type: "RESET_CHART_CONTROLS" };
};

export const updateReverse = (propKey: string | number, value: boolean) => {
	return { type: "UPDATE_REVERSE", payload: { propKey, value } };
};

export const updatePieAxisOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_PIE_AXIS_OPTIONS", payload: { propKey, option, value } };
};

export const updateAxisOptions = (
	propKey: string | number,
	axis: any,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_AXIS_OPTIONS", payload: { propKey, axis, option, value } };
};

export const updateGaugeAxisOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_GAUGE_AXIS_OPTIONS", payload: { propKey, option, value } };
};

//==================== calender chart ======================================

export const updateCalendarStyleOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_CALENDER_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateBoxPlotStyleOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_BOXPLOT_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateTreeMapStyleOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_TREEMAP_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateSankeyStyleOptions = (
	propKey: string | number,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_SANKEY_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateRichText = (propKey: string | number, value: string | number) => {
	return { type: "UPDATE_RICH_TEXT", payload: { propKey, value } };
};
