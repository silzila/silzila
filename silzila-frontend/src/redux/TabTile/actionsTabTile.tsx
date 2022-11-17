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
	resetTabState,
	showDashboardInTab,
	updateNextTileId,
	updateSelectedTileToTab,
} from "./TabActions";
import {
	toggleEditingTile,
	updateNextTabId,
	updateSelectedTab,
	updateSelectedTile,
} from "./TabTileActionsAndMultipleDispatches";
import { addTile, removeTile, removeTilesOfTab, renameTile, resetTileState } from "./TileActions";

// //  *************************************************************
// //  to tile state reducer
// //  *************************************************************

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

// export const setTileRenameEnable = (tabId, tileId) => {
// 	return {
// 		type: "TILE_RENAME_ENABLE",
// 		payload: { tabId: tabId, tileId: tileId },
// 	};
// };

// //  *************************************************************
// //  to tabTiles meta state (tabTileProps) reducer
// //  *************************************************************

//tab tile mtsp
export const toggleEditingTab = (isTrue: boolean) => {
	return { type: "EDITING_TAB", payload: isTrue };
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

// //  *************************************************************
// //  Load Playbook data to many different reducers
// //  *************************************************************

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
