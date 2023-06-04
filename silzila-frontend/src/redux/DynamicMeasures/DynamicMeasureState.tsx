import update from "immutability-helper";

const initialProperties: any = {
	selectedTabId: 1,
	selectedTileId: 1,
	selectedDynamicMeasureId: 1,
	selectedDataSetList: [],
	tablesForSelectedDataSets: {},
	dynamicMeasureProps: {},
	dynamicMeasureList: {},
};

const DynamicMeasureReducer = (state: any = initialProperties, action: any) => {
	switch (action.type) {
		//1//have to call this whilre user select the rich text
		case "SET_SELECTED_DATASET_FOR_DYNAMICMEASURE":
			return {
				...state,
				selectedDataSetList: [...state.selectedDataSetList, action.payload],
			};

		case "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TAB":
			let dynamicMeasureKey: string = `${action.payload.tileId}.${action.payload.dynamicMeasureId}`;
			return {
				...state,
				selectedTabId: action.payload.tabId,
				selectedTileId: action.payload.tileId,
				selectedDynamicMeasureId: action.payload.dynamicMeasureId,
				dynamicMeasureProps: {
					...state.dynamicMeasureProps,
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							totalDms: 1,
							[dynamicMeasureKey]: {
								selectedToEdit: false,
								usedInTextEditor: false,
								isCurrentlySelected: false,
								chartData: "",
								dmValue: null,
								dynamicMeasureId: action.payload.dynamicMeasureId,
								dynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
								editedDynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
								editName: false,
								tabId: action.payload.tabId,
								tileId: action.payload.tileId,

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
										name: "Measure",
										fields: [],
										isCollapsed: false,
									},
								],
								chartFilters: [],

								// DataViewerBottom Dataset selected and tables to list
								selectedDs: action.payload.selectedDataset,
								selectedTable: {},

								titleOptions: {
									fontSize: 28,
									titleLeftPadding: "15px",
									titleAlign: "left",
									chartTitle: "",
									generateTitle: "Auto",
								},
								chartOptionSelected: "Format",
								formatOptions: {
									labelFormats: {
										formatValue: "Number",
										currencySymbol: "₹",
										enableRounding: "false",
										roundingDigits: 1,
										numberSeparator: "Abbrev",
									},
								},
								styleOptions: {
									backgroundColor: "white",
									fontColor: "black",
									fontStyle: "normal",
								},

								conditionalFormats: [],

								// {
								// condtion Type:
								// target value:
								// isSatisfied:
								// backgroundColor:
								// 	fontColor:
								// isItalic:
								// 	isBold:
								// isUnderlined:
								// }
							},
						},
					},
				},
				dynamicMeasureList: {
					...state.dynamicMeasureList,
					[action.payload.tabId]: {
						[action.payload.tileId]: [dynamicMeasureKey],
					},
				},
			};

		case "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TILE":
			let dynamicMeasureKey1: string = `${action.payload.tileId}.${action.payload.dynamicMeasureId}`;
			console.log(state.dynamicMeasureList);
			return update(state, {
				selectedTileId: { $set: action.payload.tileId },
				selectedDynamicMeasureId: { $set: action.payload.dynamicMeasureId },
				dynamicMeasureProps: {
					[action.payload.tabId]: {
						$merge: {
							[action.payload.tileId]: {
								totalDms: 1,
								[dynamicMeasureKey1]: {
									selectedToEdit: false,
									usedInTextEditor: false,
									isCurrentlySelected: false,
									chartData: "",
									dmValue: null,
									dynamicMeasureId: action.payload.dynamicMeasureId,
									dynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
									editedDynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
									editName: false,
									tabId: action.payload.tabId,
									tileId: action.payload.tileId,
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
											name: "Measure",
											fields: [],
											isCollapsed: false,
										},
									],
									chartFilters: [],

									// DataViewerBottom Dataset selected and tables to list
									selectedDs: action.payload.selectedDataset,
									selectedTable: {},

									titleOptions: {
										fontSize: 28,
										titleLeftPadding: "15px",
										titleAlign: "left",
										chartTitle: "",
										generateTitle: "Auto",
									},
									chartOptionSelected: "Format",
									formatOptions: {
										labelFormats: {
											formatValue: "Number",
											currencySymbol: "₹",
											enableRounding: "false",
											roundingDigits: 1,
											numberSeparator: "Abbrev",
										},
									},
									styleOptions: {
										backgroundColor: "white",
										fontColor: "black",
										fontStyle: "normal",
									},
									conditionalFormats: [],
								},
							},
						},
					},
				},
				dynamicMeasureList: {
					[action.payload.tabId]: {
						$merge: { [action.payload.tileId]: [dynamicMeasureKey1] },
					},
				},
			});

		case "ADD_NEW_DYNAMIC_MEASURE_FOR_SAME_TILE":
			console.log(action.payload);
			let dynamicMeasureKey2: string = `${action.payload.tileId}.${action.payload.dynamicMeasureId}`;
			console.log(state.dynamicMeasureList[action.payload.tabId][action.payload.tileId]);

			return update(state, {
				selectedDynamicMeasureId: { $set: action.payload.dynamicMeasureId },
				dynamicMeasureProps: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							totalDms: {
								$set:
									Number(
										state.dynamicMeasureProps[action.payload.tabId][
											action.payload.tileId
										].totalDms
									) + 1,
							},
							$merge: {
								[dynamicMeasureKey2]: {
									selectedToEdit: false,
									usedInTextEditor: false,
									isCurrentlySelected: false,
									chartData: "",
									dmValue: null,

									dynamicMeasureId: action.payload.dynamicMeasureId,
									dynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
									editedDynamicMeasureName: `measure ${action.payload.dynamicMeasureId}`,
									editName: false,

									tabId: action.payload.tabId,
									tileId: action.payload.tileId,
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
											name: "Measure",
											fields: [],
											isCollapsed: false,
										},
									],
									chartFilters: [],

									// DataViewerBottom Dataset selected and tables to list
									selectedDs: action.payload.selectedDataset,
									selectedTable: {},

									titleOptions: {
										fontSize: 28,
										titleLeftPadding: "15px",
										titleAlign: "left",
										chartTitle: "",
										generateTitle: "Auto",
									},
									chartOptionSelected: "Format",
									formatOptions: {
										labelFormats: {
											formatValue: "Number",
											currencySymbol: "₹",
											enableRounding: "false",
											roundingDigits: 1,
											numberSeparator: "Abbrev",
										},
									},
									styleOptions: {
										backgroundColor: "white",
										isBold: false,
										isUnderlined: false,
										isItalic: false,
										fontColor: "black",
									},
									conditionalFormats: [],
								},
							},
						},
					},
				},
				dynamicMeasureList: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							$set: [
								...state.dynamicMeasureList[action.payload.tabId][
									action.payload.tileId
								],
								dynamicMeasureKey2,
							],
						},
					},
				},
			});

		case "SET_SELECTED_TABLE":
			let dynamicMeasureKey3: string = `${state.selectedTileId}.${state.selectedDynamicMeasureId}`;
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[dynamicMeasureKey3]: {
								selectedTable: { $set: action.payload.selectedTable },
							},
						},
					},
				},
			});
		case "SET_SELECTED_TILE_ID":
			return update(state, {
				selectedTileId: {
					$set: action.payload,
				},
			});

		case "SET_SELECTED_TAB_ID":
			return update(state, {
				selectedTileId: {
					$set: action.payload,
				},
			});
		case "SET_SELECTED_DYNAMIC_MEASURE_ID":
			return update(state, {
				selectedDynamicMeasureId: {
					$set: action.payload,
				},
			});

		case "UPDATE_DYNAMIC_MEASURE_AXES":
			if (
				state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId][
					`${state.selectedTileId}.${state.selectedDynamicMeasureId}`
				].chartAxes[action.payload.bIndex].fields.length < action.payload.allowedNumbers
			) {
				return update(state, {
					dynamicMeasureProps: {
						[state.selectedTabId]: {
							[state.selectedTileId]: {
								[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
									chartAxes: {
										[action.payload.bIndex]: {
											fields: { $push: [action.payload.item] },
										},
									},
									axesEdited: { $set: true },
								},
							},
						},
					},
				});
			} else {
				return update(state, {
					dynamicMeasureProps: {
						[state.selectedTabId]: {
							[state.selectedTileId]: {
								[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
									chartAxes: {
										[action.payload.bIndex]: {
											fields: {
												$splice: [[0, 1]],
												$push: [action.payload.item],
											},
										},
									},
									axesEdited: { $set: true },
								},
							},
						},
					},
				});
			}

		case "DISCARD_DYNAMIC_MEASURE_CREATION":
			var elementToDiscard =
				state.dynamicMeasureList[state.selectedTabId][state.selectedTileId];

			delete state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId][
				`${state.selectedTileId}.${state.selectedDynamicMeasureId}`
			];
			console.log(state.dynamicMeasureProps);
			return update(state, {
				selectedDynamicMeasureId: { $set: state.selectedDynamicMeasureId - 1 },
				dynamicMeasureList: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							$splice: [[elementToDiscard.length - 1, 1]],
						},
					},
				},
				dynamicMeasureProps: {
					$set: state.dynamicMeasureProps,
				},
			});

		case "UPDATE_CHART_DATA_FOR_DM":
			console.log(action.payload);
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								chartData: { $set: action.payload },
								dmValue: {
									$set: action.payload[0][Object.keys(action.payload[0])[0]],
								},
								dynamicMeasureName: { $set: Object.keys(action.payload[0])[0] },
								editedDynamicMeasureName: {
									$set: Object.keys(action.payload[0])[0],
								},
							},
						},
					},
				},
			});
		case "UPDATE_DYNAMIC_MEASURE_NAME":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								dynamicMeasureName: { $set: action.payload },
								editedDynamicMeasureName: { $set: action.payload },
							},
						},
					},
				},
			});
		case "RENAME_DYNAMIC_MEASURE":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								editedDynamicMeasureName: { $set: action.payload },
							},
						},
					},
				},
			});
		case "DELETE_DYNAMIC_MEASURE":
			var elementToDelete =
				state.dynamicMeasureList[action.payload.tabId][action.payload.tileId];

			delete state.dynamicMeasureProps[action.payload.tabId][action.payload.tileId][
				`${action.payload.tileId}.${action.payload.dmId}`
			];
			console.log(state.dynamicMeasureProps);
			return update(state, {
				// selectedDynamicMeasureId: { $set: action.payload.dmId - 1 },
				dynamicMeasureList: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							$splice: [[elementToDelete.length - 1, 1]],
						},
					},
				},
				dynamicMeasureProps: {
					$set: state.dynamicMeasureProps,
				},
			});
		case "UPDATE_TITLE_OPTIONS":
			console.log(action.payload);
			return update(state, {
				dynamicMeasureProps: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							[action.payload.dmPropKey]: {
								[action.payload.option]: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "ON_CHECK_ON_DYNAMIC_MEASURE":
			if (action.payload.value) {
				var keysArr = Object.keys(
					state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId]
				).filter((el: any, index: number) => {
					return index !== 0;
				});

				keysArr.map((id: string) => {
					if (
						state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId][id]
							.dynamicMeasureId !== action.payload.dmId
					) {
						state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId][
							id
						].isCurrentlySelected = false;
					}
				});
			}
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${action.payload.dmId}`]: {
								usedInTextEditor: { $set: action.payload.value },
								isCurrentlySelected: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "CHANGE_DYNAMIC_MEASURE_OPTION":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								chartOptionSelected: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "UPDATE_FORMAT_FOR_DM":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[action.payload.dmKey]: {
								formatOptions: {
									labelFormats: {
										[action.payload.option]: { $set: action.payload.value },
									},
								},
							},
						},
					},
				},
			});

		case "SET_SELECTED_TO_EDIT":
			return update(state, {
				dynamicMeasureProps: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							[`${action.payload.tileId}.${action.payload.dmId}`]: {
								selectedToEdit: { $set: action.payload.value },
							},
						},
					},
				},
			});

		case "DISCARD_CREATION_OF_FIRST_DM":
			var elementToDelete =
				state.dynamicMeasureList[action.payload.tabId][action.payload.tileId];

			state.dynamicMeasureProps[action.payload.tabId][action.payload.tileId].totalDms -= 1;

			delete state.dynamicMeasureProps[action.payload.tabId][action.payload.tileId][
				`${action.payload.tileId}.${action.payload.dmId}`
			];

			return update(state, {
				dynamicMeasureList: {
					[action.payload.tabId]: {
						[action.payload.tileId]: {
							$splice: [[elementToDelete.length - 1, 1]],
						},
					},
				},
				dynamicMeasureProps: {
					$set: state.dynamicMeasureProps,
				},
			});

		case "UPDATE_SYLE_OPTIONS":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								styleOptions: {
									[action.payload.option]: { $set: action.payload.value },
								},
							},
						},
					},
				},
			});

		case "ADD_NEW_CONDITION":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								conditionalFormats: {
									$push: [action.payload],
								},
							},
						},
					},
				},
			});

		case "CHANGE_CONDITIONAL_FORMAT":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								conditionalFormats: {
									$set: action.payload,
								},
							},
						},
					},
				},
			});
		default:
			return state;
	}
};
export default DynamicMeasureReducer;
