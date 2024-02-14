import update from "immutability-helper";
import { tableObjProps } from "./DatasetStateInterfaces";
import { ActionTypeOfDataSet, UserTableProps } from "./DatasetStateInterfaces";

const initialState = {
	isFlatFile: false,
	dsId: "",
	connection: "",
	schema: "",
	tables: [],
	arrows: [],
	tempTable: [],
	relationships: [],
	dataSetList: [],
	dataConnectionList: [],
	datasetName: "", //friendly_name changed into datasetName
	serverName: "",
	databaseName: "",
	views: [],
};

const DataSetReducer = (state: any = initialState, action: ActionTypeOfDataSet) => {
	switch (action.type) {
		case "SET_CREATE_DS_FROM_FLATFILE":
			return update(state, { isFlatFile: { $set: action.payload } });
		// sets databaseName to state
		case "SET_DATABASE_NAME":
			return update(state, { databaseName: { $set: action.payload } });

		case "SET_SERVER_NAME":
			return update(state, { serverName: { $set: action.payload } });

		// sets DC id to state
		case "SET_CONNECTION_VALUE":
			return update(state, { connection: { $set: action.payload } });

		// sets DS id to state
		case "SET_DS_ID":
			return update(state, { dsId: { $set: action.payload } });

		// sets Friendly name to state
		case "SET_DATASET_NAME":
			return update(state, { datasetName: { $set: action.payload } });

		// sets Schema Name to state
		case "SET_DATA_SCHEMA":
			return update(state, { schema: { $set: action.payload } });

		// sets list of tables for a selected schema to state
		case "SET_TABLES":
			return update(state, { tables: { $set: action.payload } });

		case "SET_TEMP_TABLES":
			// return update(state, { tempTable: { $set: action } });
			return update(state, { tempTable: { $set: action.payload } });

		// When a table in sidebar is checked / unchecked, update state accordingly
		case "ON_CHECKED":
			const x = state.tables.map((tab: UserTableProps) => {
				if (tab.id === action.payload) {
					if (tab.isSelected === true) {
						var is_in_relationship = state.relationships.filter(
							(obj: any) =>
								obj.startId === action.payload || obj.endId === action.payload
						)[0];
						if (is_in_relationship) {
							var yes = window.confirm("are you sure you want to remove this table?");
							if (yes) {
								tab.isSelected = !tab.isSelected;
								state.tempTable.forEach((el: tableObjProps) => {
									if (el.id === tab.id) {
										el.isSelected = false;
									}
								});
							}
						} else {
							tab.isSelected = !tab.isSelected;
							state.tempTable.forEach((el: tableObjProps) => {
								if (el.id === tab.id) {
									el.isSelected = false;
								}
							});
						}
					} else {
						tab.isSelected = !tab.isSelected;
					}
				}
				return tab;
			});

			const tempArray = state.tempTable.filter((item: tableObjProps) => {
				return item.isSelected === true;
			});

			return update(state, { tables: { $set: [...x] }, tempTable: { $set: [...tempArray] } });

		// Tables that are selected in sidebar and to be displayed in canvas
		case "ADD_TABLE":
			return update(state, { tempTable: { $push: [action.payload] } });

		// Remove all arrows belonging to a particular table (whether the arrow starts or ends in this table)

		case "REMOVE_ARROWS":
			const y = state.arrows.filter((arr: any) => {
				return arr.startId !== action.payload;
			});
			const z = y.filter((arr: any) => {
				return arr.endId !== action.payload;
			});
			return update(state, { arrows: { $set: [...z] } });

		case "REMOVE_ARROWS_FROM_DEL_REL":
			const arr = state.arrows.filter((arr: any) => {
				return arr.relationId !== action.payload;
			});
			return update(state, { arrows: { $set: arr } });

		case "REMOVE_INDI_ARROW_FROM_REL_POPOVER":
			var index = state.arrows.findIndex(
				(arr: any) => arr.start === action.payload.start && arr.end === action.payload.end
			);

			return update(state, { arrows: { $splice: [[index, 1]] } });

		// bring to Initial state. Used when dataconnection is changed from sidebar
		case "RESET_STATE":
			return initialState;

		//
		case "ADD_NEW_RELATIONSHIP":
			return update(state, { relationships: { $push: [action.payload] } });

		case "DELETE_RELATIONSHIP_FROM_TABLELIST":
			const y1 = state.relationships.filter((rel: any) => {
				return rel.startId !== action.relationId;
			});
			const z1 = y1.filter((rel: any) => {
				return rel.endId !== action.relationId;
			});
			return update(state, { relationships: { $set: z1 } });

		case "DELETE_RELATIONSHIP_FROM_CANVAS":
			const rels = state.relationships.filter(
				(rel: any) => rel.relationId !== action.payload
			);
			return update(state, { relationships: { $set: rels } });

		case "UPDATE_RELATIONSHIP":
			var index2 = state.relationships.findIndex(
				(rel: any) => rel.relationId === action.payload.relationId
			);

			var oldRelationsArray = state.relationships.slice();
			oldRelationsArray.splice(index2, 1);
			oldRelationsArray.push(action.payload.relation);

			var oldArrows = state.arrows.slice();
			var relArrows = oldArrows.filter(
				(arr: any) => arr.relationId === action.payload.relationId
			);

			relArrows.forEach((arr: any) => {
				arr.integrity = action.payload.relation.integrity;
				arr.cardinality = action.payload.relation.cardinality;
				arr.showHead = action.payload.relation.showHead;
				arr.showTail = action.payload.relation.showTail;
			});

			oldArrows.push(relArrows);

			return update(state, {
				relationships: { $set: oldRelationsArray },
				arrows: { $set: oldArrows },
			});

		// Adding information required to draw an arrow
		case "ADD_ARROWS":
			return update(state, { arrows: { $push: [action.payload] } });

		case "CLICK_ON_ARROW":
			return update(state, { arrows: { $set: [...action.payload] } });

		// case "SET_ARROW_TYPE":
		// 	return update(state, { arrowType: { $set: [...action.payload] } });

		case "SET_DATASET_LIST":
			return update(state, { dataSetList: { $set: action.payload } });
		case "SET_DATACONNECTION_LIST":
			return update(state, { dataConnectionList: { $set: action.payload } });

		case "SET_RELATIONSHIP_ARRAY":
			return update(state, { relationships: { $set: action.payload } });

		case "SET_ARROWS":
			return update(state, { arrows: { $set: action.payload } });
		case "SET_VIEWS":
			return update(state, { views: { $set: action.payload } });

		case "ON_CHECKED_ON_VIEW":
			const x1 = state.views.map((tab: any) => {
				if (tab.id === action.payload) {
					if (tab.isSelected === true) {
						var is_in_relationship = state.relationships.filter(
							(obj: any) =>
								obj.startId === action.payload || obj.endId === action.payload
						)[0];
						if (is_in_relationship) {
							var yes = window.confirm("are you sure you want to remove this table?");
							if (yes) {
								tab.isSelected = !tab.isSelected;
								state.tempTable.forEach((el: tableObjProps) => {
									if (el.id === tab.id) {
										el.isSelected = false;
									}
								});
							}
						} else {
							tab.isSelected = !tab.isSelected;
							state.tempTable.forEach((el: tableObjProps) => {
								if (el.id === tab.id) {
									el.isSelected = false;
								}
							});
						}
					} else {
						tab.isSelected = !tab.isSelected;
					}
				}
				return tab;
			});

			const tempArray1 = state.tempTable.filter((item: tableObjProps) => {
				return item.isSelected === true;
			});

			return update(state, {
				views: { $set: x1 },
				tempTable: { $set: tempArray1 },
			});

		default:
			return state;
	}
};

export default DataSetReducer;
