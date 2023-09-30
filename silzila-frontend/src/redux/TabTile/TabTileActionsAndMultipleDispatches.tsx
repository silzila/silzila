import { Dispatch } from "redux";
import {
	addControl,
	removeChartControls,
	removeMultipleChartControls,
	resetChartControls,
} from "../ChartPoperties/ChartControlsActions";
import {
	addProp,
	changeChartType,
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
	resetTabState,
	showDashboardInTab,
	updateNextTileId,
	updateSelectedTileToTab,
} from "./TabActions";
import { addTile, removeTile, removeTilesOfTab, renameTile, resetTileState } from "./TileActions";

//1
export const updateNextTabId = () => {
	return { type: "UPDATE_NEXT_TAB_ID" };
};

//2
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

//3
export const toggleEditingTab = (isTrue: boolean) => {
	return { type: "EDITING_TAB", payload: isTrue };
};
//4
export const toggleEditingTile = (isTrue: boolean) => {
	return { type: "EDITING_TILE", payload: isTrue };
};

//5
export const updateSelectedTile = (tileName: string, tileId: number, nextTileId: number) => {
	return {
		type: "SELECTED_TILE",
		payload: {
			tileName: tileName,
			tileId: tileId,
			nextTileId: nextTileId,
		},
	};
};

//6

export const setDragging = (dragging: boolean | any) => {
	return { type: "SET_DRAGGING", payload: dragging };
};

//7
export const selectedTable = (id: any) => {
	return { type: "SET_TABLE", payload: id };
};

//8
export const chartPropsLeftUpdated = (updated: any) => {
	return { type: "CHART_PROP_UPDATED", payload: updated };
};
//9
export const showDashBoard = (showDash: boolean) => {
	return { type: "SHOW_DASHBOARD", payload: showDash };
};

//10
export const setDashGridSize = (gridSize: any) => {
	return { type: "SET_DASH_GRID_SIZE", payload: gridSize };
};
//11
export const setSelectedDataSetList = (dataset: any) => {
	return { type: "SET_SELECTED_DATASET_LIST", payload: dataset };
};
//12
export const setTablesForSelectedDataSets = (tablesForSelectedDataSets: any) => {
	return { type: "TABLES_FOR_SELECTED_DATASETS", payload: tablesForSelectedDataSets };
};
//13
export const toggleColumnsOnlyDisplay = (displayOnlyCol: boolean) => {
	return { type: "TOGGLE_COLUMNS_ONLY_DISPLAY", payload: displayOnlyCol };
};

//14
export const toggleShowDataViewerBottom = (show: boolean) => {
	return { type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM", payload: show };
};
//15
export const toggleDashMode = (dashMode: string) => {
	return { type: "TOGGLE_DASH_MODE", payload: dashMode };
};
//16
export const setSelectedControlMenu = (menu: string) => {
	return { type: "SET_SELECTED_CONTROL_MENU", payload: menu };
};

//17
export const loadTabTileProps = (tabTileProps: any) => {
	return { type: "LOAD_TAB_TILE_PROPS_FROM_PLAYBOOK", payload: tabTileProps };
};

//18
export const resetTabTileState = () => {
	return { type: "RESET_TABTILE_PROPS" };
};

//19
export const setDashTileSwitched = (isSwitched:boolean) => {
	return { type: "SET_DASH_TILE_SWITCHED",  payload: isSwitched };
};


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// MULTIPLE DISPATCHES
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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
	let tabname: string = `Tab - ${tabId}`;
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
	let tileName: string = `Tile - ${nextTileId}`;
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
	var propKey: string = `${tabId}.${tileId}`;
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

export const actionsToRemoveTab = (
	tabName: string,
	tabId: number,
	tabToRemoveIndex: number,
	newObj?: any
) => {
	return (dispatch: Dispatch<any>) => {
		if (newObj) {
			dispatch(
				updateSelectedTab(newObj.tabName, newObj.tabId, newObj.showDash, newObj.dashMode)
			);
			dispatch(
				updateSelectedTile(
					newObj.selectedTileName,
					newObj.selectedTileId,
					newObj.nextTileId
				)
			);
		}
		dispatch(removeTab(tabName, tabId, tabToRemoveIndex));
		dispatch(removeTilesOfTab(tabName, tabId));
		dispatch(removeMultipleChartProperties(tabId));
		dispatch(removeMultipleChartControls(tabId));
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
}: {
	tabId: number;
	nextTileId: number;
	table: any;
	fromTab: any;
	selectedDs: any;
	selectedTablesInDs: any;
	chartName: string;
}) => {
	//let tileName = tileName ? tileName : `Tile - ${nextTileId}`;
	// let tileName = `Tile - ${nextTileId}`;
	let tileName: any;
	return (dispatch: Dispatch<any>) => {
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
		// }
	};
};
