// This file is used for storing all data related to properties of charts that
// need not result in rerender of the chart immediately

import update from "immutability-helper";
import { ChartPropertiesActionsProps, ChartPropertiesProps } from "./ChartPropertiesInterfaces";

const chartProperties: ChartPropertiesProps = {
	properties: {
		1.1: {
			// General Tab Info

			tabId: 1,
			tileId: 1,

			chartType: "crossTab",
			isDynamicMeasureWindowOpened: false,
			addMeasureInTextEditor: false,

			// Left Column
			axesEdited: false,
			filterRunState: false,
			chartAxes: [
				{
					name: "Filter",
					fields: [],
					isCollapsed: false,
					any_condition_match: false,
					is_auto_filter_enabled: true,
				},
				{
					name: "Row",
					fields: [],
					isCollapsed: false,
				},
				{
					name: "Column",
					fields: [],
					isCollapsed: false,
				},
				{
					name: "Measure",
					fields: [],
					isCollapsed: false,
				},
			],
			chartFilters: [],

			// DataViewerBottom Dataset selected and tables to list
			selectedDs: {},
			selectedTable: {},

			titleOptions: {
				fontSize: 28,
				titleLeftPadding: "15px",
				titleAlign: "left",
				chartTitle: "",
				generateTitle: "Auto",
			},
			chartOptionSelected: "Title",
		},
	},

	propList: { 1: ["1.1"] },
};

const chartPropertiesState = (
	state: ChartPropertiesProps = chartProperties,
	action: ChartPropertiesActionsProps & any
) => {
	const findCardIndex = (propKey: any, fromBIndex: any, fromUid: any) => {
		var removeIndex = state.properties[propKey].chartAxes[fromBIndex].fields.findIndex(
			(obj: any) => obj.uId === fromUid
		);
		return removeIndex;
	};

	const findCardObject = (propKey: any, bIndex: any, uId: any) => {
		var cardIndex = state.properties[propKey].chartAxes[bIndex].fields.findIndex(
			(obj: any) => obj.uId === uId
		);
		var card = state.properties[propKey].chartAxes[bIndex].fields[cardIndex];

		return {
			cardIndex,
			card,
		};
	};

	switch (action.type) {
		// ########################################################################################################################
		// ########################################################################################################################
		// Left Column properties CRUD Operation

		case "ADD_NEW_PROP":
			let tileKey: string = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						chartType: "crossTab",
						isDynamicMeasureWindowOpened: false,

						// Left Column
						axesEdited: false,
						filterRunState: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
								isCollapsed: false,
								any_condition_match: false,
								is_auto_filter_enabled: true,
							},
							{
								name: "Row",
								fields: [],
								isCollapsed: false,
							},
							{
								name: "Column",
								fields: [],
								isCollapsed: false,
							},
							{
								name: "Measure",
								fields: [],
								isCollapsed: false,
							},
						],
						chartFilters: [],

						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,

						titleOptions: {
							fontSize: 28,
							titleLeftPadding: "20px",
							titleAlign: "left",
							chartTitle: "",
							generateTitle: "Auto",
						},

						chartOptionSelected: "Colors",
					},
				},
				propList: {
					...state.propList,
					[action.payload.tabId]: [...state.propList[action.payload.tabId], tileKey],
				},
			};

		case "ADD_NEW_PROP_FROM_TAB":
			let tileKey2: string = `${action.payload.tabId}.${action.payload.tileId}`;

			return {
				properties: {
					...state.properties,
					[tileKey2]: {
						// General Tab Info
						tabId: action.payload.tabId,
						tileId: action.payload.tileId,
						chartType: "crossTab",
						isDynamicMeasureWindowOpened: false,

						// Left Column
						axesEdited: false,
						filterRunState: false,
						chartAxes: [
							{
								name: "Filter",
								fields: [],
								isCollapsed: false,
								any_condition_match: false,
								is_auto_filter_enabled: true,
							},
							{
								name: "Row",
								fields: [],
								isCollapsed: false,
							},
							{
								name: "Column",
								fields: [],
								isCollapsed: false,
							},
							{
								name: "Measure",
								fields: [],
								isCollapsed: false,
							},
						],
						chartFilters: [],
						selectedDs: action.payload.selectedDs,
						selectedTable: action.payload.selectedTablesInDs,

						titleOptions: {
							fontSize: 28,
							titleLeftPadding: "20px",
							titleAlign: "left",
							chartTitle: "",
							generateTitle: "Auto",
						},

						chartOptionSelected: "Colors",
					},
				},
				propList: { ...state.propList, [action.payload.tabId]: [tileKey2] },
			};

		case "DUPLICATE_CHART_PROP":
			return update(state, {
				properties: { [action.payload.propKey]: { $set: action.payload.chartProperty } },
			});

		case "DELETE_PROP":
			return update(state, {
				properties: { $unset: [action.payload.propKey] },
				propList: { [action.payload.tabId]: { $splice: [[action.payload.tileIndex, 1]] } },
			});

		case "DELETE_PROPS_OF_TAB":
			let propsToRemove = state.propList[action.payload];
			return update(state, {
				properties: { $unset: propsToRemove },
				propList: { $unset: [action.payload] },
			});

		case "SET_SELECTED_DS_IN_TILE":
			return update(state, {
				properties: {
					[action.payload.propKey]: { selectedDs: { $set: action.payload.selectedDs } },
				},
			});

		case "SET_SELECTED_TABLE_IN_TILE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						selectedTable: { $merge: action.payload.selectedTable },
					},
				},
			});

		// ########################################################################################################################
		// ########################################################################################################################
		// Chart Axes Operations

		case "CLEAR_DROPZONE_FIELDS":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$set: [],
								},
							},
						},
					},
				},
			});

		case "UPDATE_DROPZONE_EXPAND_COLLAPSE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								isCollapsed: {
									$set: action.payload.isCollapsed,
								},
							},
						},
					},
				},
			});

		case "UPDATE_FILTER_ANY_CONDITION_MATCH":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								any_condition_match: {
									$set: action.payload.any_condition_match,
								},
							},
						},
						axesEdited: { $set: true },
					},
				},
			});

		case "UPDATE_IS_AUTO_FILTER_ENABLED":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								is_auto_filter_enabled: {
									$set: action.payload.is_auto_filter_enabled,
								},
							},
						},
					},
				},
			});

		case "UPDATE_PROP":
			if (
				state.properties[action.payload.propKey].chartAxes[action.payload.bIndex].fields
					.length < action.payload.allowedNumbers
			) {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.bIndex]: {
									fields: { $push: [action.payload.item] },
								},
							},
						},
					},
				});
			} else {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.bIndex]: {
									fields: { $splice: [[0, 1]], $push: [action.payload.item] },
								},
							},
						},
					},
				});
			}

		case "MOVE_ITEM":
			var removeIndex = findCardIndex(
				action.payload.propKey,
				action.payload.fromBIndex,
				action.payload.fromUID
			);

			if (
				state.properties[action.payload.propKey].chartAxes[action.payload.toBIndex].fields
					.length < action.payload.allowedNumbers
			) {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.toBIndex]: {
									fields: { $push: [action.payload.item] },
								},
								[action.payload.fromBIndex]: {
									fields: { $splice: [[removeIndex, 1]] },
								},
							},
						},
					},
				});
			} else {
				return update(state, {
					properties: {
						[action.payload.propKey]: {
							chartAxes: {
								[action.payload.toBIndex]: {
									fields: { $splice: [[0, 1]], $push: [action.payload.item] },
								},
								[action.payload.fromBIndex]: {
									fields: { $splice: [[removeIndex, 1]] },
								},
							},
						},
					},
				});
			}

		case "DELETE_ITEM_FROM_PROP":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.binIndex]: {
								fields: { $splice: [[action.payload.itemIndex, 1]] },
							},
						},
					},
				},
			});

		case "TOGGLE_AXES_EDITED":
			return update(state, {
				properties: {
					[action.payload.propKey]: { axesEdited: { $set: action.payload.axesEdited } },
				},
			});

		case "TOGGLE_FILTER_RUN_STATE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						filterRunState: { $set: action.payload.filterRunState },
						axesEdited: { $set: true },
					},
				},
			});

		case "UPDATE_AXES_QUERY_PARAM":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.binIndex]: {
								fields: {
									$splice: [[action.payload.itemIndex, 1, action.payload.item]],
								},
							},
						},
					},
				},
			});

		case "CHANGE_CHART_TYPE":
			return update(state, {
				properties: {
					[action.payload.propKey]: { chartType: { $set: action.payload.chartType } },
				},
			});

		case "CHANGE_CHART_AXES":
			return update(state, {
				properties: {
					[action.payload.propKey]: { chartAxes: { $set: action.payload.newAxes } },
				},
			});

		case "REUSE_DATA":
			return update(state, {
				properties: {
					[action.payload.propKey]: { reUseData: { $set: action.payload.reUseData } },
				},
			});

		// ########################################
		// Title

		case "SET_CHART_TITLE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { chartTitle: { $set: action.payload.title } },
					},
				},
			});

		case "SET_GENERATE_TITLE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { generateTitle: { $set: action.payload.generateTitle } },
					},
				},
			});

		case "SET_TITLE_ALIGN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { titleAlign: { $set: action.payload.align } },
					},
				},
			});

		case "SET_TITLE_SIZE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						titleOptions: { fontSize: { $set: action.payload.value } },
					},
				},
			});

		// ########################################
		// Drag and Drop cards between dropzones

		case "SORT_ITEM":
			var dropIndex = findCardIndex(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.dropUId
			);
			var dragObj = findCardObject(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.dragUId
			);

			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$splice: [
										[dragObj.cardIndex, 1],
										[dropIndex, 0, dragObj.card],
									],
								},
							},
						},
					},
				},
			});

		case "REVERT_ITEM":
			var dragObj2 = findCardObject(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.uId
			);
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$splice: [
										[dragObj2.cardIndex, 1],
										[action.payload.originalIndex, 0, dragObj2.card],
									],
								},
							},
						},
					},
				},
			});

		case "CHANGE_CHART_OPTION":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartOptionSelected: { $set: action.payload.chartOption },
					},
				},
			});

		case "LOAD_CHART_PROPERTIES":
			return action.payload;

		case "RESET_CHART_PROPERTY":
			return chartProperties;

		case "UPDATE_LEFT_FILTER_ITEM":
			var cardIndex = findCardIndex(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.item.uId
			);
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$splice: [[cardIndex, 1, action.payload.item]],
								},
							},
						},
						axesEdited: { $set: true },
					},
				},
			});

		case "UPDATE_FILTER_EXPAND_COLLAPSE":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						chartAxes: {
							[action.payload.bIndex]: {
								fields: {
									$set: action.payload.item,
								},
							},
						},
						axesEdited: { $set: true },
					},
				},
			});
		case "SET_DYNAMIC_MEASURE_WINDOW_OPEN":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						isDynamicMeasureWindowOpened: { $set: action.payload.value },
					},
				},
			});
		case "ADD_MEASURE_IN_TEXT_EDITOR":
			return update(state, {
				properties: {
					[action.payload.propKey]: {
						addMeasureInTextEditor: { $set: action.payload.value },
					},
				},
			});

		default:
			return state;
	}
};

export default chartPropertiesState;
