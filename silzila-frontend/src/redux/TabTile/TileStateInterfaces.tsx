export interface TilesProps {
	[key: number | string]: {
		tabId: number;
		tileId: number;
		tileName: string;
		graphSizeFull: boolean;
	};
}
export interface TileListProps {
	[key: number | string]: string[];
}

export interface TileStateProps {
	tiles: TilesProps;
	tileList: TileListProps;
}

export interface TileStateProps2 {
	tileState: TileStateProps;
}

//1
interface AddTile {
	type: "ADD_TILE";
	payload: { tabId: number; tileId: number };
}
//2
interface AddTileFromTab {
	type: "ADD_TILE_FROM_TAB";
	payload: { tabId: number; tileId: number };
}

//3
interface RemoveTilesOfTab {
	type: "REMOVE_TILES_OF_TAB";
	payload: {
		tabName: string;
		tabId: number;
	};
}
//4
interface RenameTile {
	type: "RENAME_TILE";
	payload: { tabId: number; tileId: number; renameValue: string };
}

//5
interface RemoveTile {
	type: "REMOVE_TILE";
	payload: { tabId: number; tileId: number; tileIndex: number };
}

//6
interface ToggleGraphSize {
	type: "TOGGLE_GRAPH_SIZE";
	payload: { tileKey: number; graphSize: boolean };
}

//7;
interface LoadTileState {
	type: "LOAD_TILE_STATE_FROM_PLAYBOOK";
	payload: any;
}
//8
interface ResetTileState {
	type: "RESET_TILE_STATE";
}

export type ActionsOfTileState =
	| AddTileFromTab
	| AddTile
	| RemoveTilesOfTab
	| RenameTile
	| RemoveTile
	| ToggleGraphSize
	| LoadTileState
	| ResetTileState;
