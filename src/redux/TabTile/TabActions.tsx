//1
export const addTab = (tabId: number) => {
	return {
		type: "ADD_TAB",
		payload: tabId,
	};
};

//2
export const removeTab = (tabName: string, tabId: number, tabToRemoveIndex: number) => {
	return {
		type: "REMOVE_TAB",
		payload: { tabName: tabName, tabId: tabId, tabToRemoveIndex: tabToRemoveIndex },
	};
};
//3
export const renameTab = (renameValue: string, tabId: number) => {
	return {
		type: "RENAME_TAB",
		payload: {
			renameValue: renameValue,
			tabId: tabId,
		},
	};
};
//4
export const updateNextTileId = (nextTileId: number, tabId: number) => {
	return {
		type: "UPDATE_NEXT_TILE_ID",
		payload: {
			nextTileId: nextTileId,
			tabId: tabId,
		},
	};
};

//5
export const updateSelectedTileToTab = (tabId: number, tileName: string, tileId: number) => {
	return {
		type: "SELECTED_TILE_IN_TAB",
		payload: {
			tabId: tabId,
			tileName: tileName,
			tileId: tileId,
		},
	};
};
//6
export const showDashboardInTab = (tabId: number, showDash: boolean) => {
	return { type: "SHOW_DASHBOARD_IN_TAB", payload: { tabId, showDash } };
};

//7
export const toggleDashModeInTab = (tabId: number, dashMode: string) => {
	return { type: "TOGGLE_DASH_MODE_IN_TAB", payload: { tabId, dashMode } };
};

//8
export const updateTabDashDetails = (
	checked: boolean,
	propKey: string,
	dashSpecs: any,
	tabId: number,
	propIndex: number
) => {
	return {
		type: "UPDATE_DASH_GRAPH_DETAILS",
		payload: { checked, propKey, dashSpecs, tabId, propIndex },
	};
};

//9
export const removeTilesInDashDuringDeleteTile = (tabId: number, propKey: string) => {
	return { type: "REMOVE_TILES_IN_DASH_DURING_DELETE_TILE", payload: { tabId, propKey } };
};
//10
export const updateDashGraphPosition = (tabId: number, propKey: string, x: any, y: any) => {
	return { type: "UPDATE_DASH_GRAPH_POSITION", payload: { tabId, propKey, x, y } };
};
//11
export const updateDashGraphSize = (
	tabId: number,
	propKey: string,
	x: any,
	y: any,
	width: any,
	height: any
) => {
	return { type: "UPDATE_DASH_GRAPH_SIZE", payload: { tabId, propKey, x, y, width, height } };
};

//14
export const setDashLayout = (tabId: number, value: any) => {
	return { type: "SET_DASHLAYOUT", payload: { tabId, value } };
};
//15
export const setDashLayoutSelectedOptionForAuto = (tabId: number, value: any) => {
	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO", payload: { tabId, value } };
};

//16
export const setAspectRatioHeight = (tabId: number, value: any) => {
	return { type: "SET_ASPECTRATIO_HEIGHT", payload: { tabId, value } };
};
//17
export const setAspectRatioWidth = (tabId: number, value: any) => {
	return { type: "SET_ASPECTRATIO_WIDTH", payload: { tabId, value } };
};
//18
export const setCustomHeight = (tabId: number, value: any) => {
	return { type: "SET_CUSTOM_HEIGHT", payload: { tabId, value } };
};
//19
export const setCustomWidth = (tabId: number, value: any) => {
	return { type: "SET_CUSTOM_WIDTH", payload: { tabId, value } };
};
//20
export const setCustomRMaxWidth = (tabId: number, value: any) => {
	return { type: "SET_CR_MAX_WIDTH", payload: { tabId, value } };
};
//21
export const setCustomRMinWidth = (tabId: number, value: any) => {
	return { type: "SET_CR_MIN_WIDTH", payload: { tabId, value } };
};
//22
export const setCustomRMaxHeight = (tabId: number, value: any) => {
	return { type: "SET_CR_MAX_HEIGHT", payload: { tabId, value } };
};

//23
export const setCustomRMinHeight = (tabId: number, value: any) => {
	return { type: "SET_CR_MIN_HEIGHT", payload: { tabId, value } };
};

//24
export const setDashLayoutSelectedOptionForFixed = (tabId: number, value: any) => {
	return { type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED", payload: { tabId, value } };
};

//25
export const loadTabState = (tabState: any) => {
	return { type: "LOAD_TAB_STATE_FROM_PLAYBOOK", payload: tabState };
};
//26

export const resetTabState = () => {
	return { type: "RESET_TAB_STATE" };
};

export const resetGraphHighlight = (tabId: any) => {
	return { type: "RESET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId } };
};

export const updateGraphHighlight = (tabId: number, propKey: string, highlight: any) => {
	return { type: "SET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId, propKey, highlight } };
};
