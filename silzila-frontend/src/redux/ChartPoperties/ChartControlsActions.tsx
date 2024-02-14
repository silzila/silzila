import { ChartControlsProps } from "./ChartControlsInterface";

export const updateChartData = (propKey: string, chartData: string | any) => {
	return {
		type: "UPDATE_CHART_DATA",
		payload: { propKey, chartData },
	};
};
export const updateQueryResult = (propKey: string, query: string | any) => {
	return {
		type: "UPDATE_QUERY_DATA",
		payload: { propKey, query },
	};
};

export const setColorScheme = (propKey: string, color: string) => {
	return { type: "CHANGE_COLOR_SCHEME", payload: { propKey, color } };
};

export const setAreaColorOptions = (propKey: string, option: string, value: string | number) => {
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

export const duplicateControl = (propKey: string, chartControl: ChartControlsProps) => {
	return { type: "DUPLICATE_CHART_CONTROL", payload: { propKey, chartControl } };
};

export const removeChartControls = (
	tabId: number | string,
	tileId: number | string,
	propKey: string,
	tileIndex: number | string
) => {
	return { type: "DELETE_CONTROLS", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultipleChartControls = (tabId: number) => {
	return { type: "DELETE_CONTROLS_OF_TAB", payload: tabId };
};

// ===================================
// Color Scale
export const setColorScaleOption = (option: string, value: string | number, propKey: string) => {
	return {
		type: "SET_COLOR_SCALE_OPTION",
		payload: { option: option, value: value, propKey: propKey },
	};
};

export const addingNewStep = (propKey: string, index: string | number, value: number | string) => {
	return {
		type: "ADDING_NEW_STEP",
		payload: { propKey: propKey, index: index, value: value },
	};
};

export const changingValuesofSteps = (propKey: string, value: number | string) => {
	return {
		type: "CHANGING_VALUES_OF_STEPS",
		payload: { propKey: propKey, value: value },
	};
};

export const switchAutotoManualinSteps = (propKey: string, value: string | number) => {
	return {
		type: "SWITCH_STEPS_AUTO_MANUAL",
		payload: { propKey: propKey, value: value },
	};
};
// ===================================
// Labels

export const updateCrossTabStyleOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_STYLE_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateCrossTabHeaderLabelOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_HEADER_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateCrossTabCellLabelOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_CROSSTAB_CELL_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateLabelOption = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return {
		type: "UPDATE_LABEL_OPTIONS",
		payload: { propKey: propKey, option: option, value: value },
	};
};

export const updateLabelPosition = (propKey: string, value: string | number) => {
	return {
		type: "UPDATE_LABEL_POSITION",
		payload: { propKey: propKey, value: value },
	};
};
export const updateLabelPadding = (propKey: string, value: string | number) => {
	return {
		type: "UPDATE_LABEL_PADDING",
		payload: { propKey: propKey, value: value },
	};
};

// ===================================
// Format

export const updateFormatOption = (
	propKey: string,
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
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_LEGEND_OPTIONS", payload: { propKey, option, value } };
};

export const resetLegendOptions = (propKey: string, marginValues: any, legendValues: any) => {
	return { type: "RESET_LEGEND_OPTIONS", payload: { propKey, marginValues, legendValues } };
};

// ==============================
// Margin

export const updateChartMargins = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_CHART_MARGINS", payload: { propKey, option, value } };
};

export const setSelectedMargin = (propKey: string, margin: any) => {
	return { type: "SELECTED_MARGIN", payload: { propKey, margin } };
};

// ==============================
// MouseOver

export const enableMouseOver = (propKey: string, enable: any) => {
	return { type: "ENABLE_MOUSE_OVER", payload: { propKey, enable } };
};

// ==============================
// Grid & Axis

export const enableGrid = (propKey: string, value: string | number, show: any) => {
	return { type: "ENABLE_GRID", payload: { propKey, value, show } };
};

export const updateAxisMinMax = (propKey: string, axisKey: any, axisValue: any) => {
	return { type: "AXIS_MIN_MAX", payload: { propKey, axisKey, axisValue } };
};
export const updateAxisMinMaxforScatter = (propKey: string, axisKey: any, axisValue: any) => {
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

export const updateReverse = (propKey: string, value: boolean) => {
	return { type: "UPDATE_REVERSE", payload: { propKey, value } };
};

export const updatePieAxisOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_PIE_AXIS_OPTIONS", payload: { propKey, option, value } };
};

export const updateAxisOptions = (
	propKey: string,
	axis: any,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_AXIS_OPTIONS", payload: { propKey, axis, option, value } };
};

export const updateGaugeAxisOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_GAUGE_AXIS_OPTIONS", payload: { propKey, option, value } };
};

//==================== calender chart ======================================

export const updateCalendarStyleOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_CALENDER_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateBoxPlotStyleOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_BOXPLOT_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateTreeMapStyleOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_TREEMAP_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateSankeyStyleOptions = (
	propKey: string,
	option: string | number,
	value: string | number
) => {
	return { type: "UPDATE_SANKEY_STYLE_OPTIONS", payload: { propKey, option, value } };
};

export const updateRichText = (propKey: string, value: string | number) => {
	return { type: "UPDATE_RICH_TEXT", payload: { propKey, value } };
};

export const updateRichTextOnAddingDYnamicMeasure = (
	propKey: string,
	value: boolean,
	dmValue: string | number,
	style: any,
	dmId: string | number
) => {
	return {
		type: "UPDATE_RICH_TEXT_ON_ADDING_DYNAMIC_MEASURE",
		payload: { propKey, value, dmValue, style, dmId },
	};
};

export const updateCardControls = (propKey: string, option: string, value: any) => {
	return { type: "UPDATE_CARD_CONTROLS", payload: { propKey, option, value } };
};

export const clearRichText = (propKey: string) => {
	return { type: "CLEAR_RICH_TEXT", payload: { propKey } };
};
export const addTableConditionalFormats = (propKey: string, item: any) => {
	return { type: "ADD_TABLE_CONDITIONAL_FORMATS", payload: { propKey, item } };
};
export const deleteTablecf = (propKey: string, index: number) => {
	return { type: "DELETE_TABLE_CONDITIONAL_FORMATS", payload: { propKey, index } };
};
export const updatecfObjectOptions = (propKey: string, index: number, item: any) => {
	return { type: "UPDATE_CF_OBJECT1", payload: { propKey, index, item } };
};
export const updateRuleObjectOptions = (
	propKey: string,
	objectIndex: number,
	itemIndex: number,
	item: any
) => {
	return { type: "UPDATE_RULE_OBJECT", payload: { propKey, objectIndex, itemIndex, item } };
};

//new code
export const addTableLabel = (propKey: string, item: any) => {
	return { type: "ADD_TABLE_CONDITIONAL_FORMATS", payload: { propKey, item } };
};

export const updatecfObjectOptions1 = (propKey: string, item: any) => {
	return { type: "UPDATE_CF_OBJECT", payload: { propKey, item } };
};

export const addOrEditSimplecardConditionalFormat = (propKey: string, item: any) => {
	return { type: "ADD_OR_EDIT_SIMPLECARD_CF", payload: { propKey, item } };
};

export const SortChartData= (propKey: string, chartData: string | any) => {
	return {
		type: "SORT_CHART_DATAS",
		payload: { propKey, chartData },
	};
};

export const SortOrder= (propKey: string, order: string) => {
	return {
		type: "SORT_ORDER",
		payload: { propKey, order },
	};
};

export const SortedValue= (propKey: string, value: string | any) => {
	return {
		type: "SORTED_VALUE",
		payload: { propKey, value },
	};
};
