// ==============================================================
// Chart Axes (left Column) CRUD Operations
// ==============================================================

import { Dispatch } from "redux";
import { TabTilPropsSelectedDatasetList } from "../TabTile/TabTilePropsInterfaces";

export const addProp = (
	tabId: number,
	nextTileId: number,
	table: any,
	newTab: boolean,
	selectedDs: TabTilPropsSelectedDatasetList,
	selectedTablesInDs: any
) => {
	if (newTab) {
		return {
			type: "ADD_NEW_PROP_FROM_TAB",
			payload: { tabId, tileId: nextTileId, table, selectedDs, selectedTablesInDs },
		};
	} else {
		return {
			type: "ADD_NEW_PROP",
			payload: {
				tabId: tabId,
				tileId: nextTileId,
				table: table,
				selectedDs,
				selectedTablesInDs,
			},
		};
	}
};
export const duplicateChartProperty = (propKey: string, chartProperty: any) => {
	return { type: "DUPLICATE_CHART_PROP", payload: { propKey, chartProperty } };
};

export const removeChartProperties = (
	tabId: string | number,
	tileId: string | number,
	propKey: string,
	tileIndex: string | number
) => {
	return { type: "DELETE_PROP", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultipleChartProperties = (tabId: string | number) => {
	return { type: "DELETE_PROPS_OF_TAB", payload: tabId };
};

export const setSelectedDsInTile = (propKey: string, selectedDs: any) => {
	return { type: "SET_SELECTED_DS_IN_TILE", payload: { propKey, selectedDs } };
};

export const setSelectedTableInTile = (propKey: string, selectedTable: any) => {
	return { type: "SET_SELECTED_TABLE_IN_TILE", payload: { propKey, selectedTable } };
};

// Actions From Chart Axes Dustbin

export const updateDropZoneExpandCollapsePropLeft = (
	propKey: string,
	bIndex: string | number,
	isCollapsed: any
) => {
	return { type: "UPDATE_DROPZONE_EXPAND_COLLAPSE", payload: { propKey, bIndex, isCollapsed } };
};

export const updateFilterAnyContidionMatchPropLeft = (
	propKey: string,
	bIndex: number | string,
	any_condition_match: any,
	currentChartAxesName : string = "chartAxes"
) => {
	return {
		type: "UPDATE_FILTER_ANY_CONDITION_MATCH",
		payload: { propKey, bIndex, any_condition_match, currentChartAxesName },
	};
};

export const updateIsAutoFilterEnabledPropLeft = (
	propKey: string,
	bIndex: number | string,
	is_auto_filter_enabled: any,
	currentChartAxesName : string= "chartAxes"
) => {
	return {
		type: "UPDATE_IS_AUTO_FILTER_ENABLED",
		payload: { propKey, bIndex, is_auto_filter_enabled, currentChartAxesName },
	};
};

export const clearDropZoneFieldsChartPropLeft = (propKey: string, bIndex: number | string, currentChartAxesName : string = "chartAxes") => {
	return { type: "CLEAR_DROPZONE_FIELDS", payload: { propKey, bIndex, currentChartAxesName } };
};

export const updateChartPropLeft = (
	propKey: string,
	bIndex: number,
	item: any,
	allowedNumbers: any,
	currentChartAxesName : string = "chartAxes"

) => {
	return { type: "UPDATE_PROP", payload: { propKey, bIndex, item, allowedNumbers,currentChartAxesName } };
};

export const moveItemChartProp = (
	propKey: string,
	fromBIndex: any,
	fromUID: any,
	item: any,
	toBIndex: any,
	allowedNumbers: any,
	currentChartAxesName : string = "chartAxes"
) => {
	return {
		type: "MOVE_ITEM",
		payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers, currentChartAxesName },
	};
};

export const deleteItemInChartProp = (propKey: string, binIndex: number, itemIndex: number, currentChartAxesName : string = "chartAxes") => {
	return {
		type: "DELETE_ITEM_FROM_PROP",
		payload: {
			propKey,
			binIndex,
			itemIndex,
			currentChartAxesName
		},
	};
};

export const updateAxesQueryParam = (
	propKey: string,
	binIndex: number,
	itemIndex: number,
	item: any,
	currentChartAxesName : string = "chartAxes"
) => {
	return { type: "UPDATE_AXES_QUERY_PARAM", payload: { propKey, binIndex, itemIndex, item,currentChartAxesName } };
};


export const toggleAxesEdited = (propKey: string, axesEdited: any) => {
	return { type: "TOGGLE_AXES_EDITED", payload: { propKey, axesEdited } };
};

export const toggleFilterRunState = (propKey: string, filterRunState: any) => {
	return { type: "TOGGLE_FILTER_RUN_STATE", payload: { propKey, filterRunState } };
};

export const editChartPropItem = (action: any, details: any) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleAxesEdited(details.propKey, true));
		switch (action) {
			case "update":
				dispatch(
					updateChartPropLeft(
						details.propKey,
						details.bIndex,
						details.item,
						details.allowedNumbers,
						details.currentChartAxesName || "chartAxes"
					)
				);
				break;

			case "move":
				dispatch(
					moveItemChartProp(
						details.propKey,
						details.fromBIndex,
						details.fromUID,
						details.item,
						details.toBIndex,
						details.allowedNumbers,
						details.currentChartAxesName || "chartAxes"
					)
				);
				break;

			case "delete":
				dispatch(
					deleteItemInChartProp(details.propKey, details.binIndex, details.itemIndex,details.currentChartAxesName || "chartAxes")
				);
				break;

			case "updateQuery":
				dispatch(
					updateAxesQueryParam(
						details.propKey,
						details.binIndex,
						details.itemIndex,
						details.item,
						details.currentChartAxesName || "chartAxes"
					)
				);
				break;

			default:
				break;
		}
	};
};


export const changeChartType = (propKey: string, chartType: string) => {
	return {
		type: "CHANGE_CHART_TYPE",
		payload: { propKey, chartType },
	};
};

export const changeChartAxes = (propKey: string, newAxes: any, currentChartAxesName : string = "chartAxes") => {
	return { type: "CHANGE_CHART_AXES", payload: { propKey, newAxes, currentChartAxesName } };
};

export const changeChartTypeAndAxes = (propKey: string, chartType: string, newAxes: any, currentChartAxesName : string = "chartAxes") => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleAxesEdited(propKey, true));
		dispatch(changeChartAxes(propKey, newAxes, currentChartAxesName));
		dispatch(changeChartType(propKey, chartType));
	};
};

export const canReUseData = (propKey: string, reUseData: boolean | any) => {
	return { type: "REUSE_DATA", payload: { propKey, reUseData } };
};

export const setChartTitle = (propKey: string, title: string) => {
	return { type: "SET_CHART_TITLE", payload: { propKey, title } };
};

export const setGenerateTitle = (propKey: string, generateTitle: any) => {
	return {
		type: "SET_GENERATE_TITLE",
		payload: { propKey, generateTitle },
	};
};

export const setTitleAlignment = (propKey: string, align: string) => {
	return {
		type: "SET_TITLE_ALIGN",
		payload: { propKey, align },
	};
};
export const setTitleSize = (propKey: string, value: number) => {
	return {
		type: "SET_TITLE_SIZE",
		payload: { propKey, value },
	};
};

export const sortAxes = (
	propKey: string,
	bIndex: number,
	dragUId: string | number,
	dropUId: string | number,
	currentChartAxesName : string = "chartAxes"
) => {
	return {
		type: "SORT_ITEM",
		payload: { propKey, bIndex, dragUId, dropUId, currentChartAxesName },
	};
};

export const revertAxes = (
	propKey: string,
	bIndex: number,
	uId: string | number,
	originalIndex: any,
	currentChartAxesName : string = "chartAxes"
) => {
	return {
		type: "REVERT_ITEM",
		payload: { propKey, bIndex, uId, originalIndex,currentChartAxesName },
	};
};

// ==============================================================
// Chart Options (rightColumn)
// ==============================================================

export const changeChartOptionSelected = (propKey: string, chartOption: any) => {
	return {
		type: "CHANGE_CHART_OPTION",
		payload: { propKey, chartOption },
	};
};

export const loadChartProperties = (chartProperties: any) => {
	return { type: "LOAD_CHART_PROPERTIES", payload: chartProperties };
};

// ==============================
// Reset state

export const resetChartProperties = () => {
	return { type: "RESET_CHART_PROPERTY" };
};

export const updateLeftFilterItem = (propKey: string, bIndex: number, item: any, currentChartAxesName : string = "chartAxes") => {
	return { type: "UPDATE_LEFT_FILTER_ITEM", payload: { propKey, bIndex, item, currentChartAxesName } };
};
export const updtateFilterExpandeCollapse = (
	propKey: string,
	bIndex: number | string,
	item: any,
	currentChartAxesName : string = "chartAxes"
) => {
	return { type: "UPDATE_FILTER_EXPAND_COLLAPSE", payload: { propKey, bIndex, item, currentChartAxesName } };
};

export const setDynamicMeasureWindowOpen = (propKey: string, value: boolean) => {
	return {
		type: "SET_DYNAMIC_MEASURE_WINDOW_OPEN",
		payload: { propKey, value },
	};
};

export const addMeasureInTextEditor = (propKey: string, value: boolean) => {
	return {
		type: "ADD_MEASURE_IN_TEXT_EDITOR",
		payload: { propKey, value },
	};
};


export const changeLocation = (propKey: string, value: string) => {
	return {
		type: "CHANGE_GEOMAP_LOCATION",
		payload: { propKey, value },
	};
};

export const changeGeoKey = (propKey: string, value: string) => {
	return {
		type: "CHANGE_GEOMAP_KEY",
		payload: { propKey, value },
	};
};

export const changeGeoMapUnMatched = (propKey: string, value: string) => {
	return {
		type: "CHANGE_GEOMAP_UNMATCHED",
		payload: { propKey, value },
	};
};

export const enableOverrideForUIDAction = (propKey: string, uId: string) => {
	return {
		type: "ENABLE_OVERRIDE_FOR_UID_ACTION",
		payload: { propKey, uId },
	};
};

export const createChartAxesForUID = (propKey: string, uId: string, chartAxes:any) => {
	return {
		type: "CREATE_CHARTAXES_FOR_UID",
		payload: { propKey, uId, chartAxes },
	};	
};

export const removeChartAxesForUID = (propKey: string, uId: string) => {
	return {
		type: "REMOVE_CHARTAXES_FOR_UID",
		payload: { propKey, uId },
	};
};