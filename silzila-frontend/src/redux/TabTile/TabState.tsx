import update from "immutability-helper";
import { ActionsOfTabState, TabStateProps } from "./TabStateInterfaces";

const initialTabState = {
	tabs: {
		1: {
			tabId: 1,
			tabName: "Tab - 1",
			showDash: false,
			dashMode: "Edit",
			dashLayout: {
				dashboardLayout: "Auto",
				selectedOptionForAuto: "Full Screen",
				aspectRatio: { height: 9, width: 16 },
				selectedOptionForFixed: "HD",
				custom: { height: 9, width: 16 },
				customRange: { minHeight: 9, minWidth: 16, maxHeight: 12, maxWidth: 24 },
			},

			// properties specific to tiles within this tab
			selectedTileName: "Tile - 1",
			selectedTileId: 1,
			nextTileId: 2,
			tilesInDashboard: [],
			dashTilesDetails: {},
		},
	},
	tabList: [1],
};

const tabStateReducer = (state: TabStateProps = initialTabState, action: ActionsOfTabState) => {
	switch (action.type) {
		// ==================================================================
		// Tab Properties
		// ==================================================================

		case "ADD_TAB":
			return {
				tabList: [...state.tabList, action.payload],
				tabs: {
					...state.tabs,
					[action.payload]: {
						tabId: action.payload,
						tabName: `Tab - ${action.payload}`,
						showDash: false,
						dashMode: "Edit",
						dashLayout: {
							dashboardLayout: "Auto",
							selectedOptionForAuto: "Full Screen",
							aspectRatio: { height: 9, width: 16 },
							selectedOptionForFixed: "HD",
							custom: { height: 9, width: 16 },
							customRange: {
								minHeight: 9,
								minWidth: 16,
								maxHeight: 12,
								maxWidth: 24,
							},
						},

						// properties specific to tiles within this tab
						selectedTileName: "Tile - 1",
						selectedTileId: 1,
						nextTileId: 2,
						tilesInDashboard: [],
						dashTilesDetails: {},
					},
				},
			};

		case "REMOVE_TAB":
			return update(state, {
				tabs: { $unset: [action.payload.tabId] },
				tabList: { $splice: [[action.payload.tabToRemoveIndex, 1]] },
			});

		case "RENAME_TAB":
			return update(state, {
				tabs: { [action.payload.tabId]: { tabName: { $set: action.payload.renameValue } } },
			});

		// ==================================================================
		// Tile Properties
		// ==================================================================

		case "UPDATE_NEXT_TILE_ID":
			return update(state, {
				tabs: {
					[action.payload.tabId]: { nextTileId: { $set: action.payload.nextTileId + 1 } },
				},
			});

		case "SELECTED_TILE_IN_TAB":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						selectedTileName: { $set: action.payload.tileName },
						selectedTileId: { $set: action.payload.tileId },
					},
				},
			});

		case "SHOW_DASHBOARD_IN_TAB":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						showDash: { $set: action.payload.showDash },
					},
				},
			});

		case "TOGGLE_DASH_MODE_IN_TAB":
			return update(state, {
				tabs: { [action.payload.tabId]: { dashMode: { $set: action.payload.dashMode } } },
			});

		case "UPDATE_DASH_GRAPH_DETAILS":
			if (action.payload.checked) {
				return update(state, {
					tabs: {
						[action.payload.tabId]: {
							tilesInDashboard: { $splice: [[action.payload.propIndex, 1]] },
							dashTilesDetails: { $unset: [action.payload.propKey] },
						},
					},
				});
			} else {
				return update(state, {
					tabs: {
						[action.payload.tabId]: {
							tilesInDashboard: { $push: [action.payload.propKey] },
							dashTilesDetails: {
								[action.payload.propKey]: { $set: action.payload.dashSpecs },
							},
						},
					},
				});
			}

		case "REMOVE_TILES_IN_DASH_DURING_DELETE_TILE":
			var dashTilesDetailsCopy = Object.assign(
				state.tabs[action.payload.tabId].dashTilesDetails
			);

			delete dashTilesDetailsCopy[action.payload.propKey];

			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashTilesDetails: { $set: dashTilesDetailsCopy },
					},
				},
			});

		case "UPDATE_DASH_GRAPH_POSITION":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashTilesDetails: {
							[action.payload.propKey]: {
								x: { $set: action.payload.x },
								y: { $set: action.payload.y },
							},
						},
					},
				},
			});

		case "UPDATE_DASH_GRAPH_SIZE":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashTilesDetails: {
							[action.payload.propKey]: {
								x: { $set: action.payload.x },
								y: { $set: action.payload.y },
								width: { $set: action.payload.width },
								height: { $set: action.payload.height },
							},
						},
					},
				},
			});

		case "SET_GRAPH_BORDER_HIGHLIGHT":
			var copyOfDetails = state.tabs[action.payload.tabId].dashTilesDetails;
			var items = Object.keys(copyOfDetails);

			items.forEach(item => {
				if (item === action.payload.propKey) {
					copyOfDetails[item].highlight = true;
				} else {
					copyOfDetails[item].highlight = false;
				}
			});

			return update(state, {
				tabs: { [action.payload.tabId]: { dashTilesDetails: { $set: copyOfDetails } } },
			});

		case "RESET_GRAPH_BORDER_HIGHLIGHT":
			var copyOfDetails: any = state.tabs[action.payload].dashTilesDetails;
			var items = Object.keys(copyOfDetails);

			items.forEach(item => {
				copyOfDetails[item].highlight = false;
			});

			return update(state, {
				tabs: { [action.payload]: { dashTilesDetails: { $set: copyOfDetails } } },
			});
		case "SET_DASHLAYOUT":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							dashboardLayout: { $set: action.payload.value },
						},
					},
				},
			});
		case "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							selectedOptionForAuto: { $set: action.payload.value },
							// selectedOptionForFixed: { $set: "" },
						},
					},
				},
			});
		case "SET_ASPECTRATIO_HEIGHT":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							aspectRatio: { height: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_ASPECTRATIO_WIDTH":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							aspectRatio: { width: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CUSTOM_HEIGHT":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							custom: { height: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CUSTOM_WIDTH":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							custom: { width: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CR_MAX_WIDTH":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							customRange: { maxWidth: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CR_MIN_WIDTH":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							customRange: { minWidth: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CR_MAX_HEIGHT":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							customRange: { maxHeight: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_CR_MIN_HEIGHT":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							customRange: { minHeight: { $set: action.payload.value } },
						},
					},
				},
			});
		case "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED":
			return update(state, {
				tabs: {
					[action.payload.tabId]: {
						dashLayout: {
							selectedOptionForFixed: { $set: action.payload.value },
							// selectedOptionForAuto: { $set: "" },
						},
					},
				},
			});

		case "LOAD_TAB_STATE_FROM_PLAYBOOK":
			return action.payload;

		case "RESET_TAB_STATE":
			return initialTabState;

		default:
			return state;
	}
};

export default tabStateReducer;
