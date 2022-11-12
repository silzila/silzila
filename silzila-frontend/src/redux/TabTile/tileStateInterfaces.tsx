export interface TilesProps {
	[key: number]: {
		tabId: number;
		tileId: number;
		tileName: string;
		graphSizeFull: boolean;
	};
}
export interface TileListProps {
	[key: number]: string[];
}

export interface TileStateProps {
	tiles: TilesProps;
	tileList: TileListProps;
}

export interface TileStateProps2 {
	tileState: TileStateProps;
}

interface AddTile {
	type: "ADD_TILE" | "ADD_TILE_FROM_TAB";
	payload: { tabId: number; tileId: number; newTab: boolean };
}
interface RemoveTilesOfTab {
	type: "REMOVE_TILES_OF_TAB";
	payload: {
		tabName: string;
		tabId: number;
	};
}

interface RenameTile {
	type: "RENAME_TILE";
	payload: { tabId: number; tileId: number; renameValue: string };
}

interface RemoveTile {
	type: "REMOVE_TILE";
	payload: { tabId: number; tileId: number; tileIndex: number };
}

interface ToggleGraphSize {
	type: "TOGGLE_GRAPH_SIZE";
	payload: { tileKey: number; graphSize: boolean };
}

export type ActionsOfTileState =
	| AddTile
	| RemoveTilesOfTab
	| RenameTile
	| RemoveTile
	| ToggleGraphSize;
