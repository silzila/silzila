//1 & 2
export const addTile = (tabId: number, tileId: number, newTab: boolean) => {
	if (!newTab) {
		return { type: "ADD_TILE", payload: { tabId, tileId } };
	} else {
		return { type: "ADD_TILE_FROM_TAB", payload: { tabId, tileId } };
	}
};

//3
export const removeTilesOfTab = (tabName: string, tabId: number) => {
	return {
		type: "REMOVE_TILES_OF_TAB",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};
//4
export const renameTile = (tabId: number, tileId: number, renameValue: string) => {
	return {
		type: "RENAME_TILE",
		payload: { tabId: tabId, tileId: tileId, renameValue: renameValue },
	};
};

//5
export const removeTile = (tabId: number, tileId: number, tileIndex: number) => {
	return {
		type: "REMOVE_TILE",
		payload: { tabId: tabId, tileId: tileId, tileIndex },
	};
};

//6
export const toggleGraphSize = (tileKey: string, graphSize: boolean) => {
	return {
		type: "TOGGLE_GRAPH_SIZE",
		payload: { tileKey, graphSize },
	};
};

//7;
export const loadTileState = (tileState: any) => {
	return { type: "LOAD_TILE_STATE_FROM_PLAYBOOK", payload: tileState };
};
//8
export const resetTileState = () => {
	return { type: "RESET_TILE_STATE" };
};
