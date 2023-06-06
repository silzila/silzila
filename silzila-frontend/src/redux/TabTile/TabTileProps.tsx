import update from "immutability-helper";
import { TabTileStateProps } from "./TabTilePropsInterfaces";

const initialProperties = {
	selectedTabName: "Tab - 1",
	selectedTabId: 1,
	nextTabId: 2,
	editTabName: false,
	previousTabId: 1,

	selectedTileName: "Tile - 1",
	selectedTileId: 1,
	nextTileId: 2,
	editTileName: false,
	previousTileId: 1,

	dragging: false,
	chartPropUpdated: false,
	showDash: false,
	isDashboardTileSwitched: false,
	dashMode: "Edit",
	dashGridSize: { x: null, y: null },

	columnsOnlyDisplay: false,
	showDataViewerBottom: true,
	selectedControlMenu: "Charts",

	selectedDataSetList: [],
	tablesForSelectedDataSets: {},
};

const tabTilePropsReducer = (state: TabTileStateProps = initialProperties, action: any) => {
	switch (action.type) {
		case "UPDATE_NEXT_TAB_ID":
			return { ...state, nextTabId: state.nextTabId + 1 };

		case "SELECTED_TAB":
			return {
				...state,
				selectedTabId: action.payload.tabId,
				selectedTabName: action.payload.tabName,
				showDash: action.payload.showDash,
				//when dashmode is undefined assign value as "Edit"(case: open new tab for first timme)
				dashMode: action.payload.dashMode ? action.payload.dashMode : "Edit",
			};

		case "EDITING_TAB":
			return { ...state, editTabName: action.payload };

		case "EDITING_TILE":
			return { ...state, editTileName: action.payload };

		case "SELECTED_TILE":
			return {
				...state,
				previousTabId: state.selectedTabId,
				previousTileId: state.selectedTileId,
				selectedTileName: action.payload.tileName,
				selectedTileId: action.payload.tileId,
				nextTileId: action.payload.nextTileId,
			};

		case "SET_DRAGGING":
			return {
				...state,
				dragging: action.payload,
			};

		case "SET_TABLE":
			return { ...state, selectedTable: action.payload };

		case "CHART_PROP_UPDATED":
			return { ...state, chartPropUpdated: action.payload };

		case "SHOW_DASHBOARD":
			let prevTile = 0, prevTab = 0;

			if(!state.showDash && !action.payload)
			{
				prevTile = state.previousTileId;
				prevTab  = state.previousTabId;
			}
		
			return { ...state, previousTileId:prevTile, previousTabId:prevTab, isDashboardTileSwitched: true, showDash: action.payload };

		case "SET_DASH_TILE_SWITCHED":
			return { ...state, isDashboardTileSwitched: action.payload };
		
		case "SET_DASH_GRID_SIZE":
			return { ...state, dashGridSize: action.payload };

		case "SET_SELECTED_DATASET_LIST":
			return {
				...state,
				selectedDataSetList: [...state.selectedDataSetList, action.payload],
			};

		case "TABLES_FOR_SELECTED_DATASETS":
			return update(state, { tablesForSelectedDataSets: { $merge: action.payload } });

		case "TOGGLE_COLUMNS_ONLY_DISPLAY":
			return update(state, { columnsOnlyDisplay: { $set: action.payload } });

		case "TOGGLE_SHOW_DATA_VIEWER_BOTTOM":
			return update(state, { showDataViewerBottom: { $set: action.payload } });

		case "TOGGLE_DASH_MODE":
			return update(state, { dashMode: { $set: action.payload } });

		case "SET_SELECTED_CONTROL_MENU":
			return update(state, { selectedControlMenu: { $set: action.payload } });

		case "LOAD_TAB_TILE_PROPS_FROM_PLAYBOOK":
			return action.payload;

		case "RESET_TABTILE_PROPS":
			return initialProperties;

		default:
			return state;
	}
};

export default tabTilePropsReducer;
