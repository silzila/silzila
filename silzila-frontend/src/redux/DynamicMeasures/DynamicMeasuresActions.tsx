import { Dispatch } from "redux";
import { updateRichTextOnAddingDYnamicMeasure } from "../ChartPoperties/ChartControlsActions";

export const loadDynamicMeasures = (dynamicMeasure: any) => {
	return { type: "LOAD_DYMANIC_MEASURES", payload: dynamicMeasure };
};

export const setSelectedDatasetForDynamicMeasure = (dataset: any) => {
	return { type: "SET_SELECTED_DATASET_FOR_DYNAMICMEASURE", payload: dataset };
};

export const addNewDynamicMeasurePropsFromNewTab = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TAB",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const addNewDynamicMeasurePropsFromNewTile = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TILE",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const addNewDynamicMeasurePropsForSameTile = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FOR_SAME_TILE",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const setSelectedTableForSelectedDynamicMeasure = (selectedTable: any) => {
	return {
		type: "SET_SELECTED_TABLE",
		payload: {
			selectedTable,
		},
	};
};

export const setSelectedTileIdInDynamicMeasureState = (tileId: number) => {
	return {
		type: "SET_SELECTED_TILE_ID",
		payload: tileId,
	};
};
export const setSelectedDynamicMeasureId = (dynamicMeasureId: number) => {
	return {
		type: "SET_SELECTED_DYNAMIC_MEASURE_ID",
		payload: dynamicMeasureId,
	};
};

export const setSelectedTabIdInDynamicMeasureState = (tabId: number) => {
	return {
		type: "SET_SELECTED_TAB_ID",
		payload: tabId,
	};
};

export const updateDynamicMeasureAxes = (bIndex: number, allowedNumbers: number, item: any) => {
	return {
		type: "UPDATE_DYNAMIC_MEASURE_AXES",
		payload: { bIndex, allowedNumbers, item },
	};
};

export const onDiscardDynamicMeasureCreation = () => {
	return { type: "DISCARD_DYNAMIC_MEASURE_CREATION" };
};

export const updateChartDataForDm = (chartData: any) => {
	return {
		type: "UPDATE_CHART_DATA_FOR_DM",
		payload: chartData,
	};
};
export const updateDynamicMeasureName = (dmName: any) => {
	return {
		type: "UPDATE_DYNAMIC_MEASURE_NAME",
		payload: dmName,
	};
};
export const renameDynamicMeasure = (dmName: any) => {
	return {
		type: "RENAME_DYNAMIC_MEASURE",
		payload: dmName,
	};
};

export const deletingDynamicMeasure = (tabId: number, tileId: number, dmId: number) => {
	return {
		type: "DELETE_DYNAMIC_MEASURE",
		payload: { tabId, tileId, dmId },
	};
};
export const updateTitleOptionsFordm = (
	tabId: number,
	tileId: number,
	dmPropKey: string,
	option: string,
	value: any
) => {
	return {
		type: "UPDATE_TITLE_OPTIONS",
		payload: { tabId, tileId, dmPropKey, option, value },
	};
};
export const onCheckorUncheckOnDm1 = (dmId: string, value: boolean) => {
	return {
		type: "ON_CHECK_ON_DYNAMIC_MEASURE",
		payload: { dmId, value },
	};
};

export const changeDynamicMeasureOption = (value: any) => {
	return {
		type: "CHANGE_DYNAMIC_MEASURE_OPTION",
		payload: { value },
	};
};
// updateRichTextOnAddingDYnamicMeasure;

export const onCheckorUncheckOnDm = (
	dmId: string,
	value: boolean,
	propKey: string,
	dmValue: any,
	styleObj: any
) => {
	return (dispatch: Dispatch<any>) => {

		dispatch(onCheckorUncheckOnDm1(dmId.toString().replace("RichTextID", ""), value));
		if (value) {
			// var text = ``;
			// if (styleObj.textUnderline === "none") {
			// 	text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};">${dmValue}</span>`;
			// } else {
			// 	text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};"><u>${dmValue}</u></span>`;
			// }

			dispatch(updateRichTextOnAddingDYnamicMeasure(propKey, value, dmValue, styleObj, dmId));
		} else {
			//dispatch(updateRichTextOnAddingDYnamicMeasure(propKey, value, dmValue,  null, dmId));
		}
	};
};

export const updateFormatForDm = (dmKey: string, option: string, value: any) => {
	return {
		type: "UPDATE_FORMAT_FOR_DM",
		payload: { dmKey, option, value },
	};
};

export const updateStyleOptions = (option: string, value: any) => {
	return {
		type: "UPDATE_SYLE_OPTIONS",
		payload: { option, value },
	};
};
export const addNewCondition = (conditionObj: any) => {
	return {
		type: "ADD_NEW_CONDITION",
		payload: conditionObj,
	};
};

export const updateConditionalFormat = (updateFormatArray: any) => {
	return {
		type: "CHANGE_CONDITIONAL_FORMAT",
		payload: updateFormatArray,
	};
};
// export const updateConditionalFormat = (id: string, option: string, value: any) => {
// 	return {
// 		type: "CHANGE_CONDITIONAL_FORMAT",
// 		payload: { id, option, value },
// 	};
// };

export const updateLeftFilterItemForDm = (propKey: string, bIndex: number, item: any) => {
	return { type: "UPDATE_LEFT_FILTER_ITEM_FOR_DM", payload: { propKey, bIndex, item } };
};

export const sortAxesForDm = (
	propKey: string,
	bIndex: number,
	dragUId: string | number,
	dropUId: string | number
) => {
	return {
		type: "SORT_ITEM_FOR_DM",
		payload: { propKey, bIndex, dragUId, dropUId },
	};
};

export const revertAxesForDm = (
	propKey: string,
	bIndex: number,
	uId: string | number,
	originalIndex: any
) => {
	return {
		type: "REVERT_ITEM_FOR_DM",
		payload: { propKey, bIndex, uId, originalIndex },
	};
};

export const updtateFilterExpandeCollapseForDm = (
	propKey: string,
	bIndex: number | string,
	item: any
) => {
	return { type: "UPDATE_FILTER_EXPAND_COLLAPSE_FOR_DM", payload: { propKey, bIndex, item } };
};

export const toggleAxesEditedForDm = (propKey: string, axesEdited: any) => {
	return { type: "TOGGLE_AXES_EDITED_FOR_DM", payload: { propKey, axesEdited } };
};

export const updateChartPropLeftForDm = (
	propKey: string,
	bIndex: number,
	item: any,
	allowedNumbers: any
) => {
	return { type: "UPDATE_PROP_FOR_DM", payload: { propKey, bIndex, item, allowedNumbers } };
};

export const moveItemChartPropForDm = (
	propKey: string,
	fromBIndex: any,
	fromUID: any,
	item: any,
	toBIndex: any,
	allowedNumbers: any
) => {
	return {
		type: "MOVE_ITEM_FOR_DM",
		payload: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
	};
};

export const deleteItemInChartPropForDm = (
	propKey: string,
	binIndex: number,
	itemIndex: number
) => {
	return {
		type: "DELETE_ITEM_FROM_PROP_FOR_DM",
		payload: {
			propKey,
			binIndex,
			itemIndex,
		},
	};
};

export const updateAxesQueryParamForDm = (
	propKey: string,
	binIndex: number,
	itemIndex: number,
	item: any
) => {
	return {
		type: "UPDATE_AXES_QUERY_PARAM_FOR_DM",
		payload: { propKey, binIndex, itemIndex, item },
	};
};

export const editChartPropItemForDm = (action: any, details: any) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleAxesEditedForDm(details.propKey, true));
		switch (action) {
			case "update":
				dispatch(
					updateChartPropLeftForDm(
						details.propKey,
						details.bIndex,
						details.item,
						details.allowedNumbers
					)
				);
				break;

			case "move":
				dispatch(
					moveItemChartPropForDm(
						details.propKey,
						details.fromBIndex,
						details.fromUID,
						details.item,
						details.toBIndex,
						details.allowedNumbers
					)
				);
				break;

			case "delete":
				dispatch(
					deleteItemInChartPropForDm(details.propKey, details.binIndex, details.itemIndex)
				);
				break;

			case "updateQuery":
				dispatch(
					updateAxesQueryParamForDm(
						details.propKey,
						details.binIndex,
						details.itemIndex,
						details.item
					)
				);
				break;

			default:
				break;
		}
	};
};

export const setSelectedToEdit = (tabId: number, tileId: number, dmId: number, value: boolean) => {
	return {
		type: "SET_SELECTED_TO_EDIT",
		payload: { tabId, tileId, dmId, value },
	};
};

export const discardCreationOfFirstDm = (tabId: number, tileId: number, dmId: number) => {
	return {
		type: "DISCARD_CREATION_OF_FIRST_DM",
		payload: { tabId, tileId, dmId },
	};
};
