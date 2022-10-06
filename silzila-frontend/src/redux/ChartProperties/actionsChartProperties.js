// ==============================================================
// Chart Axes (left Column) CRUD Operations
// ==============================================================

export const addProp = (tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs) => {
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
export const duplicateChartProperty = (propKey, chartProperty) => {
	return { type: "DUPLICATE_CHART_PROP", payload: { propKey, chartProperty } };
};

export const removeChartProperties = (tabId, tileId, propKey, tileIndex) => {
	return { type: "DELETE_PROP", payload: { tabId, tileId, propKey, tileIndex } };
};

export const removeMultipleChartProperties = tabId => {
	return { type: "DELETE_PROPS_OF_TAB", payload: tabId };
};

export const setSelectedDsInTile = (propKey, selectedDs) => {
	return { type: "SET_SELECTED_DS_IN_TILE", payload: { propKey, selectedDs } };
};

export const setSelectedTableInTile = (propKey, selectedTable) => {
	return { type: "SET_SELECTED_TABLE_IN_TILE", payload: { propKey, selectedTable } };
};

// Actions From Chart Axes Dustbin

export const updateDropZoneExpandCollapsePropLeft = (propKey, bIndex, isCollapsed) => {
	return { type: "UPDATE_DROPZONE_EXPAND_COLLAPSE", payload: { propKey, bIndex, isCollapsed } };
};

export const updateFilterAnyContidionMatchPropLeft = (propKey, bIndex, any_condition_match) => {
	return {
		type: "UPDATE_FILTER_ANY_CONDITION_MATCH",
		payload: { propKey, bIndex, any_condition_match },
	};
};

export const updateIsAutoFilterEnabledPropLeft = (propKey, bIndex, is_auto_filter_enabled) => {
	return {
		type: "UPDATE_IS_AUTO_FILTER_ENABLED",
		payload: { propKey, bIndex, is_auto_filter_enabled },
	};
};

export const clearDropZoneFieldsChartPropLeft = (propKey, bIndex) => {
	return { type: "CLEAR_DROPZONE_FIELDS", payload: { propKey, bIndex } };
};

export const updateChartPropLeft = (propKey, bIndex, item, allowedNumbers) => {
	return { type: "UPDATE_PROP", payload: { propKey, bIndex, item, allowedNumbers } };
};

export const moveItemChartProp = (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) => {
	return {
		type: "MOVE_ITEM",
		payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
	};
};

export const deleteItemInChartProp = (propKey, binIndex, itemIndex) => {
	return {
		type: "DELETE_ITEM_FROM_PROP",
		payload: {
			propKey,
			binIndex,
			itemIndex,
		},
	};
};

export const updateAxesQueryParam = (propKey, binIndex, itemIndex, item) => {
	return { type: "UPDATE_AXES_QUERY_PARAM", payload: { propKey, binIndex, itemIndex, item } };
};

export const toggleAxesEdited = (propKey, axesEdited) => {
	return { type: "TOGGLE_AXES_EDITED", payload: { propKey, axesEdited } };
};

export const toggleFilterRunState = (propKey, filterRunState) => {
	return { type: "TOGGLE_FILTER_RUN_STATE", payload: { propKey, filterRunState } };
};

export const editChartPropItem = ({ action, details }) => {
	return dispatch => {
		dispatch(toggleAxesEdited(details.propKey, true));
		switch (action) {
			case "update":
				dispatch(
					updateChartPropLeft(
						details.propKey,
						details.bIndex,
						details.item,
						details.allowedNumbers
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
						details.allowedNumbers
					)
				);
				break;

			case "delete":
				dispatch(
					deleteItemInChartProp(details.propKey, details.binIndex, details.itemIndex)
				);
				break;

			case "updateQuery":
				dispatch(
					updateAxesQueryParam(
						details.propKey,
						details.binIndex,
						details.itemIndex,
						details.item
					)
				);
				break;

			default:
				break;
		}
	};
};

export const changeChartType = (propKey, chartType) => {
	return { type: "CHANGE_CHART_TYPE", payload: { propKey, chartType } };
};

export const changeGeoLocation = (propKey, geoLocation) => {
	return { type: "CHANGE_GEO_LOCATION", payload: { propKey, geoLocation } };
};

export const changeChartAxes = (propKey, newAxes) => {
	return { type: "CHANGE_CHART_AXES", payload: { propKey, newAxes } };
};

export const changeChartTypeAndAxes = ({ propKey, chartType, newAxes }) => {
	return dispatch => {
		dispatch(toggleAxesEdited(propKey, true));
		dispatch(changeChartAxes(propKey, newAxes));
		dispatch(changeChartType(propKey, chartType));
	};
};

export const canReUseData = (propKey, reUseData) => {
	return { type: "REUSE_DATA", payload: { propKey, reUseData } };
};

export const setChartTitle = (propKey, title) => {
	return { type: "SET_CHART_TITLE", payload: { propKey, title } };
};

export const setGenerateTitle = (propKey, generateTitle) => {
	return {
		type: "SET_GENERATE_TITLE",
		payload: { propKey, generateTitle },
	};
};

export const setTitleAlignment = (propKey, align) => {
	return {
		type: "SET_TITLE_ALIGN",
		payload: { propKey, align },
	};
};
export const setTitleSize = (propKey, value) => {
	return {
		type: "SET_TITLE_SIZE",
		payload: { propKey, value },
	};
};

export const sortAxes = (propKey, bIndex, dragUId, dropUId) => {
	return {
		type: "SORT_ITEM",
		payload: { propKey, bIndex, dragUId, dropUId },
	};
};

export const revertAxes = (propKey, bIndex, uId, originalIndex) => {
	return {
		type: "REVERT_ITEM",
		payload: { propKey, bIndex, uId, originalIndex },
	};
};

// ==============================================================
// Chart Options (rightColumn)
// ==============================================================

export const changeChartOptionSelected = (propKey, chartOption) => {
	return {
		type: "CHANGE_CHART_OPTION",
		payload: { propKey, chartOption },
	};
};

export const loadChartProperties = chartProperties => {
	return { type: "LOAD_CHART_PROPERTIES", payload: chartProperties };
};

// ==============================
// Reset state

export const resetChartProperties = () => {
	return { type: "RESET_CHART_PROPERTY" };
};

export const updateLeftFilterItem = (propKey, bIndex, item) => {
	console.log("UPDATE_LEFT_FILTER_ITEM");
	return { type: "UPDATE_LEFT_FILTER_ITEM", payload: { propKey, bIndex, item } };
};
export const updtateFilterExpandeCollapse = (propKey, bIndex, item) => {
	console.log("UPDATE_FILTER_EXPAND_COLLAPSE");
	return { type: "UPDATE_FILTER_EXPAND_COLLAPSE", payload: { propKey, bIndex, item } };
};
