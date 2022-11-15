export const toggleDashModeInTab = (tabId: number, dashMode: string) => {
	return { type: "TOGGLE_DASH_MODE_IN_TAB", payload: { tabId, dashMode } };
};

// export const setDashLayout = (tabId, value) => {
// 	return { type: "SET_DASHLAYOUT", payload: { tabId, value } };
// };
// export const setDashLayoutSelectedOptionForAuto = (tabId, value) => {
// 	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO", payload: { tabId, value } };
// };
// export const setDashLayoutSelectedOptionForFixed = (tabId, value) => {
// 	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED", payload: { tabId, value } };
// };
// export const setAspectRatioHeight = (tabId, value) => {
// 	return { type: "SET_ASPECTRATIO_HEIGHT", payload: { tabId, value } };
// };
// export const setAspectRatioWidth = (tabId, value) => {
// 	return { type: "SET_ASPECTRATIO_WIDTH", payload: { tabId, value } };
// };
// export const setCustomHeight = (tabId, value) => {
// 	return { type: "SET_CUSTOM_HEIGHT", payload: { tabId, value } };
// };
// export const setCustomWidth = (tabId, value) => {
// 	return { type: "SET_CUSTOM_WIDTH", payload: { tabId, value } };
// };
// export const setCustomRMaxHeight = (tabId, value) => {
// 	return { type: "SET_CR_MAX_HEIGHT", payload: { tabId, value } };
// };
// export const setCustomRMaxWidth = (tabId, value) => {
// 	return { type: "SET_CR_MAX_WIDTH", payload: { tabId, value } };
// };
// export const setCustomRMinHeight = (tabId, value) => {
// 	return { type: "SET_CR_MIN_HEIGHT", payload: { tabId, value } };
// };
// export const setCustomRMinWidth = (tabId, value) => {
// 	return { type: "SET_CR_MIN_WIDTH", payload: { tabId, value } };
// };

// //  *************************************************************
// //  to tile state reducer
// //  *************************************************************
//tile state
export const addTile = (tabId: number, tileId: number, newTab: boolean) => {
	if (!newTab) {
		return { type: "ADD_TILE", payload: { tabId, tileId } };
	} else {
		return { type: "ADD_TILE_FROM_TAB", payload: { tabId, tileId } };
	}
};

// notihng
export const updateTabNameOfTile = (tabName: string, tabId: number) => {
	return {
		type: "UPDATE_TAB_NAME_OF_TILE",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

//tile state
export const removeTilesOfTab = (tabName: string, tabId: number) => {
	return {
		type: "REMOVE_TILES_OF_TAB",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

// export const setTileRenameEnable = (tabId, tileId) => {
// 	return {
// 		type: "TILE_RENAME_ENABLE",
// 		payload: { tabId: tabId, tileId: tileId },
// 	};
// };

//tile state
export const renameTile = (tabId: number, tileId: number, renameValue: string) => {
	return {
		type: "RENAME_TILE",
		payload: { tabId: tabId, tileId: tileId, renameValue: renameValue },
	};
};

//tile state
export const removeTile = (tabId: number, tileId: number, tileIndex: number) => {
	return {
		type: "REMOVE_TILE",
		payload: { tabId: tabId, tileId: tileId, tileIndex },
	};
};

//tile state
export const toggleGraphSize = (tileKey: number, graphSize: boolean) => {
	return {
		type: "TOGGLE_GRAPH_SIZE",
		payload: { tileKey, graphSize },
	};
};

// //  *************************************************************
// //  to tabTiles meta state (tabTileProps) reducer
// //  *************************************************************

//tabTile Props
export const updateNextTabId = () => {
	return { type: "UPDATE_NEXT_TAB_ID" };
};

//tabTile Props
export const updateSelectedTab = (
	tabName: string,
	tabId: number,
	showDash?: boolean,
	dashMode?: string
) => {
	return {
		type: "SELECTED_TAB",
		payload: { tabName: tabName, tabId: tabId, showDash, dashMode },
	};
};

//tab tile mtsp
export const toggleEditingTab = (isTrue: boolean) => {
	return { type: "EDITING_TAB", payload: isTrue };
};

//tab tile
export const toggleEditingTile = (isTrue: boolean) => {
	return { type: "EDITING_TILE", payload: isTrue };
};

// export const setSelectedDataSetList = payload => {
// 	return { type: "SET_SELECTED_DATASET_LIST", payload };
// };

// export const setTablesForSelectedDataSets = payload => {
// 	return { type: "TABLES_FOR_SELECTED_DATASETS", payload };
// };

// export const setDragging = dragging => {
// 	return { type: "SET_DRAGGING", payload: dragging };
// };

// export const selectedTable = id => {
// 	return { type: "SET_TABLE", payload: id };
// };

// export const chartPropsLeftUpdated = updated => {
// 	return { type: "CHART_PROP_UPDATED", payload: updated };
// };

//tab state // -- moved to sf
export const showDashBoard = (showDash: boolean) => {
	return { type: "SHOW_DASHBOARD", payload: showDash };
};

export const toggleDashMode = (dashMode: string) => {
	return { type: "TOGGLE_DASH_MODE", payload: dashMode };
};

export const setDashGridSize = (gridSize: any) => {
	return { type: "SET_DASH_GRID_SIZE", payload: gridSize };
};

//tab tile
export const toggleColumnsOnlyDisplay = (displayOnlyCol: boolean) => {
	return { type: "TOGGLE_COLUMNS_ONLY_DISPLAY", payload: displayOnlyCol };
};

export const toggleShowDataViewerBottom = (show: boolean) => {
	return { type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM", payload: show };
};

export const setSelectedControlMenu = (menu: any) => {
	return { type: "SET_SELECTED_CONTROL_MENU", payload: menu };
};

// export const updateDashGraphPosition = (tabId, propKey, x, y) => {
// 	return { type: "UPDATE_DASH_GRAPH_POSITION", payload: { tabId, propKey, x, y } };
// };

// export const updateDashGraphSize = (tabId, propKey, x, y, width, height) => {
// 	return { type: "UPDATE_DASH_GRAPH_SIZE", payload: { tabId, propKey, x, y, width, height } };
// };

export const updateGraphHighlight = (tabId: number, propKey: number, highlight: any) => {
	return { type: "SET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId, propKey, highlight } };
};

export const resetGraphHighlight = (tabId: number) => {
	return { type: "RESET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId } };
};

// //  ***************************************************************************************************************************
// //  ***************************************************************************************************************************
// //
// //  MULTIPLE DISPATCHES USING THUNK
// //
// //  ***************************************************************************************************************************
// //  ***************************************************************************************************************************

// //  *************************************************************
// //  Tab actions for multiple dispatches
// //  *************************************************************

interface ActionsToAddTab {
	tabId: number;
	table: any;
	selectedDs: any;
	selectedTablesInDs: any;
}
export const actionsToAddTab = ({
	tabId,
	table,
	selectedDs,
	selectedTablesInDs,
}: ActionsToAddTab) => {
	let tabname = `Tab - ${tabId}`;
	return (dispatch: Dispatch<any>) => {
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

export const actionsToSelectTab = (
	tabName: string,
	tabId: number,
	showDash: boolean,
	dashMode: string
) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(updateSelectedTab(tabName, tabId, showDash, dashMode));
	};
};

export const actionsToRemoveTab = (
	tabName: string,
	tabId: number,
	tabToRemoveIndex: number,
	newObj: any
) => {
	return (dispatch: Dispatch<any>) => {
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

export const actionsToEnableRenameTab = (tabId: number, isTrue: boolean) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleEditingTab(isTrue));
	};
};

export const actionsToRenameTab = (renameValue: string, tabId: number) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(updateSelectedTab(renameValue, tabId));
		dispatch(updateTabNameOfTile(renameValue, tabId));
		dispatch(renameTab(renameValue, tabId));
		dispatch(toggleEditingTab(false));
	};
};

// //  *************************************************************
// //  Tile actions for multiple dispatches
// //  *************************************************************

interface ActionsToAddTileProps {
	tabId: number;
	nextTileId: number;
	table: any;
	fromTab: boolean;
	selectedDs: any;
	selectedTablesInDs: any;
}
export const actionsToAddTile = ({
	tabId,
	nextTileId,
	table,
	fromTab: newTab,
	selectedDs,
	selectedTablesInDs,
}: ActionsToAddTileProps) => {
	//let tileName = tileName ? tileName : `Tile - ${nextTileId}`;
	// let tileName = `Tile - ${nextTileId}`;
	// console.log(table);
	let tileName: string = "";
	return (dispatch: Dispatch<any>) => {
		dispatch(addProp(tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs));
		dispatch(addControl(tabId, nextTileId, newTab));
		dispatch(addTile(tabId, nextTileId, newTab));
		dispatch(updateNextTileId(nextTileId, tabId));
		dispatch(updateSelectedTile(tileName, nextTileId, nextTileId + 1));
		dispatch(updateSelectedTileToTab(tabId, tileName, nextTileId));
		dispatch(showDashBoard(false));
	};
};

export const actionsToUpdateSelectedTile = (
	tabId: number,
	tileName: string,
	tileId: number,
	nextTileId: number,
	fromTab: boolean,
	fileId?: any
) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(updateSelectedTileToTab(tabId, tileName, tileId));
		dispatch(updateSelectedTile(tileName, tileId, nextTileId));
		// dispatch(selectedTable(fileId));
		if (!fromTab) {
			dispatch(showDashboardInTab(tabId, false));
			dispatch(showDashBoard(false));
		}
	};
};

export const actionsToEnableRenameTile = (tabId: number, tileId: number, isTrue: boolean) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToCompleteRenameTile = (
	tabId: number,
	tileId: number,
	renameValue: string,
	nextTileId: number,
	isTrue: boolean
) => {
	return (dispatch: Dispatch<any>) => {
		// dispatch(setTileRenameEnable(tabId, 100));
		dispatch(renameTile(tabId, tileId, renameValue));
		dispatch(toggleEditingTile(isTrue));
	};
};

export const actionsToRemoveTile = (tabId: number, tileId: number, tileIndex: number) => {
	var propKey = parseFloat(`${tabId}.${tileId}`);
	return (dispatch: Dispatch<any>) => {
		dispatch(removeTilesInDashDuringDeleteTile(tabId, propKey));
		dispatch(removeTile(tabId, tileId, tileIndex));
		dispatch(removeChartProperties(tabId, tileId, propKey, tileIndex));
		dispatch(removeChartControls(tabId, tileId, propKey, tileIndex));
	};
};

export const setShowDashBoard = (tabId: number, showDash: boolean) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(showDashBoard(showDash));
		dispatch(showDashboardInTab(tabId, showDash));
	};
};

// //  *************************************************************
// //  Load Playbook data to many different reducers
// //  *************************************************************

// export const loadTabState = tabState => {
// 	return { type: "LOAD_TAB_STATE_FROM_PLAYBOOK", payload: tabState };
// };

// export const loadTileState = tileState => {
// 	return { type: "LOAD_TILE_STATE_FROM_PLAYBOOK", payload: tileState };
// };

// export const loadTabTileProps = tabTileProps => {
// 	return { type: "LOAD_TAB_TILE_PROPS_FROM_PLAYBOOK", payload: tabTileProps };
// };

// export const loadPlaybook = playbook => {
// 	return dispatch => {
// 		dispatch(loadTabState(playbook.tabState));
// 		dispatch(loadTileState(playbook.tileState));
// 		dispatch(loadTabTileProps(playbook.tabTileProps));
// 		dispatch(loadChartControls(playbook.chartControl));
// 		dispatch(loadChartProperties(playbook.chartProperty));
// 		dispatch(loadSampleRecords(playbook.sampleRecords));
// 	};
// };

// //  *************************************************************
// //  Reset states
// //  *************************************************************

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
	return (dispatch: Dispatch<any>) => {
		dispatch(resetChartControls());
		dispatch(resetChartProperties());
		dispatch(resetSampleRecords());
		dispatch(resetPlayBookData());
		dispatch(resetTabState());
		dispatch(resetTileState());
		dispatch(resetTabTileState());
	};
};

// export const actionsToAddTileForRichText = ({
// 	tabId,
// 	nextTileId,
// 	table,
// 	fromTab: newTab,
// 	selectedDs,
// 	selectedTablesInDs,
// 	chartName,
// }) => {
// 	//let tileName = tileName ? tileName : `Tile - ${nextTileId}`;
// 	// let tileName = `Tile - ${nextTileId}`;
// 	// console.log(table);
// 	let tileName;
// 	return dispatch => {
// 		dispatch(addProp(tabId, nextTileId, table, newTab, selectedDs, selectedTablesInDs));
// 		dispatch(addControl(tabId, nextTileId, newTab));
// 		dispatch(addTile(tabId, nextTileId, newTab));
// 		dispatch(updateNextTileId(nextTileId, tabId));
// 		dispatch(updateSelectedTile(tileName, nextTileId, nextTileId + 1));
// 		dispatch(updateSelectedTileToTab(tabId, tileName, nextTileId));
// 		dispatch(showDashBoard(false));
// 		// dispatch(setChartTitle(`${tabId}.${nextTileId}`, chartName));
// 		dispatch(changeChartType(`${tabId}.${nextTileId}`, chartName));
// 		// if (chartName === "richText") {
// 		// 	console.log(chartName);
// 		// }
// 	};
// };

import React from "react";
import { Dispatch } from "redux";
import {
	addControl,
	removeChartControls,
	removeMultipleChartControls,
	resetChartControls,
} from "../ChartPoperties/ChartControlsActions";
import {
	addProp,
	removeChartProperties,
	removeMultipleChartProperties,
	resetChartProperties,
} from "../ChartPoperties/ChartPropertiesActions";
import { resetPlayBookData } from "../PlayBook/PlayBookActions";
import { resetSampleRecords } from "../SampleTableRecords/SampleTableRecordsActions";
import {
	addTab,
	removeTab,
	removeTilesInDashDuringDeleteTile,
	renameTab,
	showDashboardInTab,
	updateNextTileId,
	updateSelectedTile,
	updateSelectedTileToTab,
} from "./TabActions";
