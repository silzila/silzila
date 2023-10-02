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
	const findCardIndex = (propKey: any, fromBIndex: any, fromUid: any) => {
		var removeIndex = state.dynamicMeasureProps?.[`${state.selectedTabId}`]?.[
			`${state.selectedTileId}`
		]?.[propKey].chartAxes[fromBIndex].fields.findIndex((obj: any) => obj.uId === fromUid);
		return removeIndex;
	};

	const findCardObject = (propKey: any, bIndex: any, uId: any) => {
		var cardIndex = state.dynamicMeasureProps?.[`${state.selectedTabId}`]?.[
			`${state.selectedTileId}`
		]?.[propKey].chartAxes[bIndex].fields.findIndex((obj: any) => obj.uId === uId);
		var card =
			state.dynamicMeasureProps?.[`${state.selectedTabId}`]?.[`${state.selectedTileId}`]?.[
				propKey
			].chartAxes[bIndex].fields[cardIndex];

		return {
			cardIndex,
			card,
		};
	};
	switch (action.type) {
		case "LOAD_DYMANIC_MEASURES":
			return action.payload;

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
			let dynamicMeasureKey2: string = `${action.payload.tileId}.${action.payload.dynamicMeasureId}`;

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
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[`${state.selectedTileId}.${state.selectedDynamicMeasureId}`]: {
								chartData: { $set: action.payload },
								dmValue: {
									$set:
										action.payload !== ""
											? action.payload[0][Object.keys(action.payload[0])[0]]
											: null,
								},
								dynamicMeasureName: {
									$set:
										action.payload !== ""
											? Object.keys(action.payload[0])[0]
											: "",
								},
								editedDynamicMeasureName: {
									$set:
										action.payload !== ""
											? Object.keys(action.payload[0])[0]
											: "",
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
			// const temp = state.dynamicMeasureProps[
			// 	`${state.selectedTabId}.${state.selectedTileId}`
			// ][`${state.selectedTileId}.${state.selectedDynamicMeasureId}`].conditionalFormats.map(
			// 	(el: any) => {
			// 		if (el.id === action.payload.id) {
			// 			el[action.payload.option] = action.payload.value;
			// 		}
			// 		return el;
			// 	}
			// );

			// console.log(temp);
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

		case "UPDATE_LEFT_FILTER_ITEM_FOR_DM":
			var cardIndex = findCardIndex(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.item.uId
			);
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
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
					},
				},
			});

		case "SORT_ITEM_FOR_DM":
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
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
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
					},
				},
			});

		case "REVERT_ITEM_FOR_DM":
			var dragObj2 = findCardObject(
				action.payload.propKey,
				action.payload.bIndex,
				action.payload.uId
			);
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
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
					},
				},
			});
		case "UPDATE_FILTER_EXPAND_COLLAPSE_FOR_DM":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
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
					},
				},
			});

		case "DELETE_ITEM_FROM_PROP_FOR_DM":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[action.payload.propKey]: {
								chartAxes: {
									[action.payload.binIndex]: {
										fields: { $splice: [[action.payload.itemIndex, 1]] },
									},
								},
							},
						},
					},
				},
			});

		case "MOVE_ITEM_FOR_DM":
			var removeIndex = findCardIndex(
				action.payload.propKey,
				action.payload.fromBIndex,
				action.payload.fromUID
			);

			if (
				state.dynamicMeasureProps[state.selectedTabId][state.selectedTileId][
					action.payload.propKey
				].chartAxes[action.payload.toBIndex].fields.length < action.payload.allowedNumbers
			) {
				return update(state, {
					dynamicMeasureProps: {
						[state.selectedTabId]: {
							[state.selectedTileId]: {
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
						},
					},
				});
			} else {
				return update(state, {
					dynamicMeasureProps: {
						[state.selectedTabId]: {
							[state.selectedTileId]: {
								[action.payload.propKey]: {
									chartAxes: {
										[action.payload.toBIndex]: {
											fields: {
												$splice: [[0, 1]],
												$push: [action.payload.item],
											},
										},
										[action.payload.fromBIndex]: {
											fields: { $splice: [[removeIndex, 1]] },
										},
									},
								},
							},
						},
					},
				});
			}

		case "UPDATE_AXES_QUERY_PARAM_FOR_DM":
			return update(state, {
				dynamicMeasureProps: {
					[state.selectedTabId]: {
						[state.selectedTileId]: {
							[action.payload.propKey]: {
								chartAxes: {
									[action.payload.binIndex]: {
										fields: {
											$splice: [
												[action.payload.itemIndex, 1, action.payload.item],
											],
										},
									},
								},
							},
						},
					},
				},
				// properties: {
				// 	[action.payload.propKey]: {
				// 		chartAxes: {
				// 			[action.payload.binIndex]: {
				// 				fields: {
				// 					$splice: [[action.payload.itemIndex, 1, action.payload.item]],
				// 				},
				// 			},
				// 		},
				// 	},
				// },
			});

		default:
			return state;
	}
};
export default DynamicMeasureReducer;
