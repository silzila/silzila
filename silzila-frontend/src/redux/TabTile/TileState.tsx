import update from "immutability-helper";
import { ActionsOfTileState, TileStateProps } from "./TileStateInterfaces";

const initialTileState = {
	tiles: {
		1.1: {
			tabId: 1,
			tileId: 1,
			tileName: "Tile - 1",
			graphSizeFull: true,
		},
	},
	tileList: { 1: ["1.1"] },
};

const tileStateReducer = (state: TileStateProps = initialTileState, action: ActionsOfTileState) => {
	switch (action.type) {
		case "ADD_TILE":
			let tileKey: string = `${action.payload.tabId}.${action.payload.tileId}`;
			return {
				tiles: {
					...state.tiles,
					[tileKey]: {
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						tileName: `Tile - ${action.payload.tileId}`,
						graphSizeFull: true,
					},
				},
				tileList: {
					...state.tileList,
					[action.payload.tabId]: [...state.tileList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_TILE_FROM_TAB":
			let tileKey3: string = `${action.payload.tabId}.${action.payload.tileId}`;
			return {
				tiles: {
					...state.tiles,
					[tileKey3]: {
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						tileName: `Tile - ${action.payload.tileId}`,
						graphSizeFull: true,
					},
				},
				tileList: {
					...state.tileList,
					[action.payload.tabId]: [tileKey3],
				},
			};

		case "REMOVE_TILES_OF_TAB":
			let tilesToRemove: any = state.tileList[action.payload.tabId];
			return update(state, {
				tiles: { $unset: tilesToRemove },
				tileList: { $unset: [action.payload.tabId] },
			});

		case "RENAME_TILE":
			let tileKey2: string = `${action.payload.tabId}.${action.payload.tileId}`;
			return update(state, {
				tiles: { [tileKey2]: { tileName: { $set: action.payload.renameValue } } },
			});

		case "REMOVE_TILE":
			let tileKey4: string = `${action.payload.tabId}.${action.payload.tileId}`;
			return update(state, {
				tiles: { $unset: [tileKey4] },
				tileList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "TOGGLE_GRAPH_SIZE":
			return update(state, {
				tiles: {
					[action.payload.tileKey]: { graphSizeFull: { $set: action.payload.graphSize } },
				},
			});

		case "LOAD_TILE_STATE_FROM_PLAYBOOK":
			return action.payload;

		case "RESET_TILE_STATE":
			return initialTileState;
		default:
			return state;
	}
};

export default tileStateReducer;
