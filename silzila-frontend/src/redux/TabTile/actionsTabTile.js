//  ***************************************************************************************************************************
//  ***************************************************************************************************************************
//
//  Tab & Tile related actions
//
//  ***************************************************************************************************************************
//  ***************************************************************************************************************************

import {
	addControl,
	loadChartControls,
	removeChartControls,
	removeMultipleChartControls,
	resetChartControls,
} from "../ChartProperties/actionsChartControls";
import {
	removeMultipleChartProperties,
	addProp,
	removeChartProperties,
	loadChartProperties,
	resetChartProperties,
	changeChartType,
	setChartTitle,
} from "../ChartProperties/actionsChartProperties";
import { resetPlayBookData } from "../Playbook/playbookActions";
import {
	loadSampleRecords,
	resetSampleRecords,
} from "../SampleTableRecords/sampleTableRecordsActions";

//  *************************************************************
//  to tab state reducer
//  *************************************************************

export const addTab = tabId => {
	return {
		type: "ADD_TAB",
		payload: tabId,
	};
};

export const removeTab = (tabName, tabId, tabToRemoveIndex) => {
	return {
		type: "REMOVE_TAB",
		payload: { tabName: tabName, tabId: tabId, tabToRemoveIndex: tabToRemoveIndex },
	};
};

export const renameTab = (renameValue, tabId) => {
	return {
		type: "RENAME_TAB",
		payload: {
			renameValue: renameValue,
			tabId: tabId,
		},
	};
};

export const updateNextTileId = (nextTileId, tabId) => {
	return {
		type: "UPDATE_NEXT_TILE_ID",
		payload: {
			tileId: nextTileId,
			tabId: tabId,
		},
	};
};

export const updateSelectedTileToTab = (tabId, tileName, tileId) => {
	return {
		type: "SELECTED_TILE_IN_TAB",
		payload: {
			tabId: tabId,
			tileName: tileName,
			tileId: tileId,
		},
	};
};

export const showDashboardInTab = (tabId, showDash) => {
	return { type: "SHOW_DASHBOARD_IN_TAB", payload: { tabId, showDash } };
};

export const toggleDashModeInTab = (tabId, dashMode) => {
	return { type: "TOGGLE_DASH_MODE_IN_TAB", payload: { tabId, dashMode } };
};

export const updateTabDashDetails = (checked, propKey, dashSpecs, tabId, propIndex) => {
	return {
		type: "UPDATE_DASH_GRAPH_DETAILS",
		payload: { checked, propKey, dashSpecs, tabId, propIndex },
	};
};

export const setDashLayout = (tabId, value) => {
	return { type: "SET_DASHLAYOUT", payload: { tabId, value } };
};
export const setDashLayoutSelectedOptionForAuto = (tabId, value) => {
	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO", payload: { tabId, value } };
};
export const setDashLayoutSelectedOptionForFixed = (tabId, value) => {
	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED", payload: { tabId, value } };
};
export const setAspectRatioHeight = (tabId, value) => {
	return { type: "SET_ASPECTRATIO_HEIGHT", payload: { tabId, value } };
};
export const setAspectRatioWidth = (tabId, value) => {
	return { type: "SET_ASPECTRATIO_WIDTH", payload: { tabId, value } };
};
export const setCustomHeight = (tabId, value) => {
	return { type: "SET_CUSTOM_HEIGHT", payload: { tabId, value } };
};
export const setCustomWidth = (tabId, value) => {
	return { type: "SET_CUSTOM_WIDTH", payload: { tabId, value } };
};
export const setCustomRMaxHeight = (tabId, value) => {
	return { type: "SET_CR_MAX_HEIGHT", payload: { tabId, value } };
};
export const setCustomRMaxWidth = (tabId, value) => {
	return { type: "SET_CR_MAX_WIDTH", payload: { tabId, value } };
};
export const setCustomRMinHeight = (tabId, value) => {
	return { type: "SET_CR_MIN_HEIGHT", payload: { tabId, value } };
};
export const setCustomRMinWidth = (tabId, value) => {
	return { type: "SET_CR_MIN_WIDTH", payload: { tabId, value } };
};

export const removeTilesInDashDuringDeleteTile = (tabId, propKey) => {
	return { type: "REMOVE_TILES_IN_DASH_DURING_DELETE_TILE", payload: { tabId, propKey } };
};

//  *************************************************************
//  to tile state reducer
//  *************************************************************

export const addTile = (tabId, tileId, newTab) => {
	if (!newTab) {
		return { type: "ADD_TILE", payload: { tabId, tileId } };
	} else {
		return { type: "ADD_TILE_FROM_TAB", payload: { tabId, tileId } };
	}
};

export const updateTabNameOfTile = (tabName, tabId) => {
	return {
		type: "UPDATE_TAB_NAME_OF_TILE",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

export const removeTilesOfTab = (tabName, tabId) => {
	return {
		type: "REMOVE_TILES_OF_TAB",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

export const setTileRenameEnable = (tabId, tileId) => {
	return {
		type: "TILE_RENAME_ENABLE",
		payload: { tabId: tabId, tileId: tileId },
	};
};

export const renameTile = (tabId, tileId, renameValue) => {
	return {
		type: "RENAME_TILE",
		payload: { tabId: tabId, tileId: tileId, renameValue: renameValue },
	};
};

export const removeTile = (tabId, tileId, tileIndex) => {
	return {
		type: "REMOVE_TILE",
		payload: { tabId: tabId, tileId: tileId, tileIndex },
	};
};

export const toggleGraphSize = (tileKey, graphSize) => {
	return {
		type: "TOGGLE_GRAPH_SIZE",
		payload: { tileKey, graphSize },
	};
};

//  *************************************************************
//  to tabTiles meta state (tabTileProps) reducer
//  *************************************************************

export const updateNextTabId = () => {
	return { type: "UPDATE_NEXT_TAB_ID" };
};

export const updateSelectedTab = (tabName, tabId, showDash, dashMode) => {
	return {
		type: "SELECTED_TAB",
		payload: { tabName: tabName, tabId: tabId, showDash, dashMode },
	};
};

export const updateSelectedTile = (tileName, tileId, nextTileId) => {
	return {
		type: "SELECTED_TILE",
		payload: {
			tileName: tileName,
			tileId: tileId,
			nextTileId: nextTileId,
		},
	};
};

export const toggleEditingTab = isTrue => {
	return { type: "EDITING_TAB", payload: isTrue };
};

export const toggleEditingTile = isTrue => {
	return { type: "EDITING_TILE", payload: isTrue };
};

export const setSelectedDataSetList = payload => {
	return { type: "SET_SELECTED_DATASET_LIST", payload };
};

export const setTablesForSelectedDataSets = payload => {
	return { type: "TABLES_FOR_SELECTED_DATASETS", payload };
};

export const setDragging = dragging => {
	return { type: "SET_DRAGGING", payload: dragging };
};

export const selectedTable = id => {
	return { type: "SET_TABLE", payload: id };
};

export const chartPropsLeftUpdated = updated => {
	return { type: "CHART_PROP_UPDATED", payload: updated };
};

export const showDashBoard = showDash => {
	return { type: "SHOW_DASHBOARD", payload: showDash };
};

export const toggleDashMode = dashMode => {
	return { type: "TOGGLE_DASH_MODE", payload: dashMode };
};

export const setDashGridSize = gridSize => {
	return { type: "SET_DASH_GRID_SIZE", payload: gridSize };
};

export const toggleColumnsOnlyDisplay = columns => {
	return { type: "TOGGLE_COLUMNS_ONLY_DISPLAY", payload: columns };
};

export const toggleShowDataViewerBottom = show => {
	return { type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM", payload: show };
};

export const setSelectedControlMenu = menu => {
	return { type: "SET_SELECTED_CONTROL_MENU", payload: menu };
};

export const updateDashGraphPosition = (tabId, propKey, x, y) => {
	return { type: "UPDATE_DASH_GRAPH_POSITION", payload: { tabId, propKey, x, y } };
};

export const updateDashGraphSize = (tabId, propKey, x, y, width, height) => {
	return { type: "UPDATE_DASH_GRAPH_SIZE", payload: { tabId, propKey, x, y, width, height } };
};

export const updateGraphHighlight = (tabId, propKey, highlight) => {
	return { type: "SET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId, propKey, highlight } };
};

export const resetGraphHighlight = tabId => {
	return { type: "RESET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId } };
};

//  ***************************************************************************************************************************
//  ***************************************************************************************************************************
//
//  MULTIPLE DISPATCHES USING THUNK
//
//  ***************************************************************************************************************************
//  ***************************************************************************************************************************

//  *************************************************************
//  Tab actions for multiple dispatches
//  *************************************************************

export const actionsToAddTab = ({ tabId, table, selectedDs, selectedTablesInDs }) => {
	let tabname = `Tab - ${tabId}`;
	return dispatch => {
		dispatch(addTab(tabId));
		dispatch(updateNextTabId());
		dispatch(updateSelectedTab(tabname, tabId, false, "Edit"));
		dispatch(
			actionsToAddTile({
				tabId: tabId,
				nextTileId: 1,
				table: table,
				fromTab: true,
				selectedDs,
				selectedTablesInDs,
			})
		);
	};
};

export const actionsToSelectTab = ({ tabName, tabId, showDash, dashMode }) => {
	return dispatch => {
		dispatch(updateSelectedTab(tabName, tabId, showDash, dashMode));
	};
};

export const actionsToRemoveTab = ({ tabName, tabId, tabToRemoveIndex, newObj }) => {
	return dispatch => {
		dispatch(removeTab(tabName, tabId, tabToRemoveIndex));
		dispatch(removeTilesOfTab(tabName, tabId));
		dispatch(removeMultipleChartProperties(tabId));
		dispatch(removeMultipleChartControls(tabId));
		if (newObj) {
			dispatch(updateSelectedTab(newObj.tabName, newObj.tabId));
			dispatch(
				updateSelectedTile(
					newObj.selectedTileName,
					newObj.selectedTileId,
					newObj.nextTileId
				)
			);
		}
	};
};

export const actionsToEnableRenameTab = ({ tabId, isTrue }) => {
	return dispatch => {
		dispatch(toggleEditingTab(isTrue));
	};
};

export const actionsToRenameTab = ({ renameValue, tabId }) => {
	return dispatch => {
		dispatch(updateSelectedTab(renameValue, tabId));
		dispatch(updateTabNameOfTile(renameValue, tabId));
		dispatch(renameTab(renameValue, tabId));
		dispatch(toggleEditingTab(false));
	};
};

//  *************************************************************
//  Tile actions for multiple dispatches
//  *************************************************************

export const actionsToAddTile = ({
	tabId,
	nextTileId,
	table,
	fromTab: newTab,
	selectedDs,
	selectedTablesInDs,
}) => {
	//let tileName = tileName ? tileName : `Tile - ${nextTileId}`;
	// let tileName = `Tile - ${nextTileId}`;
	// console.log(table);
	let tileName;
	return dispatch => {
		dispatch(addProp(tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs));
		dispatch(addControl(tabId, nextTileId, newTab));
		dispatch(addTile(tabId, nextTileId, newTab));
		dispatch(updateNextTileId(nextTileId, tabId));
		dispatch(updateSelectedTile(tileName, nextTileId, nextTileId + 1));
		dispatch(updateSelectedTileToTab(tabId, tileName, nextTileId));
		dispatch(showDashBoard(false));
	};
};

export const actionsToUpdateSelectedTile = ({
	tabId,
	tileName,
	tileId,
	nextTileId,
	fileId,
	fromTab,
}) => {
	return dispatch => {
		dispatch(updateSelectedTileToTab(tabId, tileName, tileId));
		dispatch(updateSelectedTile(tileName, tileId, nextTileId));
		// dispatch(selectedTable(fileId));
		if (!fromTab) {
			dispatch(showDashboardInTab(tabId, false));
			dispatch(showDashBoard(false));
		}
	};
};

export const actionsToEnableRenameTile = ({ tabId, tileId, isTrue }) => {
	return dispatch => {
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToCompleteRenameTile = ({ tabId, tileId, renameValue, nextTileId, isTrue }) => {
	return dispatch => {
		// dispatch(setTileRenameEnable(tabId, 100));
		dispatch(renameTile(tabId, tileId, renameValue));
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToRemoveTile = ({ tabId, tileId, tileIndex }) => {
	var propKey = `${tabId}.${tileId}`;
	return dispatch => {
		dispatch(removeTilesInDashDuringDeleteTile(tabId, propKey));
		dispatch(removeTile(tabId, tileId, tileIndex));
		dispatch(removeChartProperties(tabId, tileId, propKey, tileIndex));
		dispatch(removeChartControls(tabId, tileId, propKey, tileIndex));
	};
};

export const setShowDashBoard = (tabId, showDash) => {
	return dispatch => {
		dispatch(showDashBoard(showDash));
		dispatch(showDashboardInTab(tabId, showDash));
	};
};

//  *************************************************************
//  Load Playbook data to many different reducers
//  *************************************************************

export const loadTabState = tabState => {
	return { type: "LOAD_TAB_STATE_FROM_PLAYBOOK", payload: tabState };
};

export const loadTileState = tileState => {
	return { type: "LOAD_TILE_STATE_FROM_PLAYBOOK", payload: tileState };
};

export const loadTabTileProps = tabTileProps => {
	return { type: "LOAD_TAB_TILE_PROPS_FROM_PLAYBOOK", payload: tabTileProps };
};

export const loadPlaybook = playbook => {
	return dispatch => {
		dispatch(loadTabState(playbook.tabState));
		dispatch(loadTileState(playbook.tileState));
		dispatch(loadTabTileProps(playbook.tabTileProps));
		dispatch(loadChartControls(playbook.chartControl));
		dispatch(loadChartProperties(playbook.chartProperty));
		dispatch(loadSampleRecords(playbook.sampleRecords));
	};
};

//  *************************************************************
//  Reset states
//  *************************************************************

export const resetTabState = () => {
	return { type: "RESET_TAB_STATE" };
};

export const resetTileState = () => {
	return { type: "RESET_TILE_STATE" };
};

export const resetTabTileState = () => {
	return { type: "RESET_TABTILE_PROPS" };
};

export const resetAllStates = () => {
	return dispatch => {
		dispatch(resetChartControls());
		dispatch(resetChartProperties());
		dispatch(resetSampleRecords());
		dispatch(resetPlayBookData());
		dispatch(resetTabState());
		dispatch(resetTileState());
		dispatch(resetTabTileState());
	};
};

export const actionsToAddTileForRichText = ({
	tabId,
	nextTileId,
	table,
	fromTab: newTab,
	selectedDs,
	selectedTablesInDs,
	chartName,
}) => {
	//let tileName = tileName ? tileName : `Tile - ${nextTileId}`;
	// let tileName = `Tile - ${nextTileId}`;
	// console.log(table);
	let tileName;
	return dispatch => {
		dispatch(addProp(tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs));
		dispatch(addControl(tabId, nextTileId, newTab));
		dispatch(addTile(tabId, nextTileId, newTab));
		dispatch(updateNextTileId(nextTileId, tabId));
		dispatch(updateSelectedTile(tileName, nextTileId, nextTileId + 1));
		dispatch(updateSelectedTileToTab(tabId, tileName, nextTileId));
		dispatch(showDashBoard(false));
		// dispatch(setChartTitle(`${tabId}.${nextTileId}`, chartName));
		dispatch(changeChartType(`${tabId}.${nextTileId}`, chartName));
		// if (chartName === "richText") {
		// 	console.log(chartName);
		// }
	};
};
