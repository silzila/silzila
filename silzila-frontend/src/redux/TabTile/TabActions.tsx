export const showDashBoard = (showDash: boolean) => {
	return { type: "SHOW_DASHBOARD", payload: showDash };
};
export const removeTab = (tabName: string, tabId: number, tabToRemoveIndex: number) => {
	return {
		type: "REMOVE_TAB",
		payload: { tabName: tabName, tabId: tabId, tabToRemoveIndex: tabToRemoveIndex },
	};
};
export const renameTab = (renameValue: string, tabId: number) => {
	return {
		type: "RENAME_TAB",
		payload: {
			renameValue: renameValue,
			tabId: tabId,
		},
	};
};
export const updateNextTileId = (nextTileId: number, tabId: number) => {
	return {
		type: "UPDATE_NEXT_TILE_ID",
		payload: {
			tileId: nextTileId,
			tabId: tabId,
		},
	};
};
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

export const showDashboardInTab = (tabId: number, showDash: boolean) => {
	return { type: "SHOW_DASHBOARD_IN_TAB", payload: { tabId, showDash } };
};

export const updateTabDashDetails = (
	checked: boolean,
	propKey: number,
	dashSpecs: any,
	tabId: number,
	propIndex: number
) => {
	return {
		type: "UPDATE_DASH_GRAPH_DETAILS",
		payload: { checked, propKey, dashSpecs, tabId, propIndex },
	};
};

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

export const toggleEditingTab = (isTrue: boolean) => {
	return { type: "EDITING_TAB", payload: isTrue };
};

export const addTab = (tabId: number) => {
	return {
		type: "ADD_TAB",
		payload: tabId,
	};
};

export const removeTilesInDashDuringDeleteTile = (tabId: number, propKey: number) => {
	return { type: "REMOVE_TILES_IN_DASH_DURING_DELETE_TILE", payload: { tabId, propKey } };
};
