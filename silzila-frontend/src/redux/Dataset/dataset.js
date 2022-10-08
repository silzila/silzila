import update from "immutability-helper";

const initialState = {
	dsId: "",
	connection: "",
	schema: "",
	tables: [],
	arrows: [],
	tempTable: [],
	relationships: [],
	dataSetList: [],
	friendly_name: "",
};

const DataSetReducer = (state = initialState, action) => {
	switch (action.type) {
		// sets DC id to state
		case "SET_CONNECTION_VALUE":
			return update(state, { connection: { $set: action.payload } });

		// sets DS id to state
		case "SET_DS_ID":
			return update(state, { dsId: { $set: action.payload } });

		// sets Friendly name to state
		case "SET_FRIENDLY_NAME":
			return update(state, { friendly_name: { $set: action.payload } });

		// sets Schema Name to state
		case "SET_DATA_SCHEMA":
			return update(state, { schema: { $set: action.payload } });

		// sets list of tables for a selected schema to state
		case "SET_TABLES":
			return update(state, { tables: { $set: action.payload } });

		case "SET_TEMP_TABLES":
			return update(state, { tempTable: { $set: action.payload } });
		// return update(state, { tempTable: { $set: [...action.payload] } });

		// When a table in sidebar is checked / unchecked, update state accordingly
		case "ON_CHECKED":
			const x = state.tables.map((tab) => {
				if (tab.id === action.payload) {
					if (tab.isSelected === true) {
						var is_in_relationship = state.relationships.filter(
							(obj) => obj.startId === action.payload || obj.endId === action.payload
						)[0];
						if (is_in_relationship) {
							var yes = window.confirm("are you sure you want to remove this table?");
							if (yes) {
								tab.isSelected = !tab.isSelected;
								state.tempTable.map((el) => {
									if (el.id === tab.id) {
										el.isSelected = false;
									}
								});
							}
						} else {
							tab.isSelected = !tab.isSelected;
							state.tempTable.map((el) => {
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

			const tempArray = state.tempTable.filter((item) => {
				return item.isSelected === true;
			});

			return update(state, { tables: { $set: [...x] }, tempTable: { $set: [...tempArray] } });

		// Tables that are selected in sidebar and to be displayed in canvas
		case "ADD_TABLE":
			return update(state, { tempTable: { $push: [action.payload] } });

		// Remove all arrows belonging to a particular table (whether the arrow starts or ends in this table)

		case "REMOVE_ARROWS":
			const y = state.arrows.filter((arr) => {
				return arr.startId !== action.payload;
			});
			const z = y.filter((arr) => {
				return arr.endId !== action.payload;
			});
			return update(state, { arrows: { $set: [...z] } });

		case "REMOVE_ARROWS_FROM_DEL_REL":
			const arr = state.arrows.filter((arr) => {
				return arr.relationId !== action.payload;
			});
			return update(state, { arrows: { $set: arr } });

		case "REMOVE_INDI_ARROW_FROM_REL_POPOVER":
			var index = state.arrows.findIndex(
				(arr) => arr.start === action.payload.start && arr.end === action.payload.end
			);

			return update(state, { arrows: { $splice: [[index, 1]] } });

		// bring to Initial state. Used when dataconnection is changed from sidebar
		case "RESET_STATE":
			return initialState;

		//
		case "ADD_NEW_RELATIONSHIP":
			return update(state, { relationships: { $push: [action.payload] } });

		case "DELETE_RELATIONSHIP_FROM_TABLELIST":
			const y1 = state.relationships.filter((rel) => {
				return rel.startId !== action.payload;
			});
			const z1 = y1.filter((rel) => {
				return rel.endId !== action.payload;
			});
			//console.log(z1);
			return update(state, { relationships: { $set: z1 } });

		case "DELETE_RELATIONSHIP_FROM_CANVAS":
			const rels = state.relationships.filter((rel) => rel.relationId !== action.payload);
			//console.log(rels);
			return update(state, { relationships: { $set: rels } });

		case "UPDATE_RELATIONSHIP":
			var index2 = state.relationships.findIndex(
				(rel) => rel.relationId === action.payload.relationId
			);

			var oldRelationsArray = state.relationships.slice();
			//console.log(JSON.stringify(oldRelationsArray, null, 4));
			oldRelationsArray.splice(index2, 1);
			oldRelationsArray.push(action.payload.relation);
			//console.log(JSON.stringify(oldRelationsArray, null, 4));

			var oldArrows = state.arrows.slice();
			var relArrows = oldArrows.filter((arr) => arr.relationId === action.payload.relationId);
			//console.log(JSON.stringify(oldArrows, null, 4));
			//console.log(JSON.stringify(relArrows, null, 4));

			relArrows.forEach((arr) => {
				arr.integrity = action.payload.relation.integrity;
				arr.cardinality = action.payload.relation.cardinality;
				arr.showHead = action.payload.relation.showHead;
				arr.showTail = action.payload.relation.showTail;
			});
			//console.log(JSON.stringify(relArrows, null, 4));

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

		case "SET_ARROW_TYPE":
			return update(state, { arrowType: { $set: [...action.payload] } });

		case "SET_DATASET_LIST":
			return update(state, { dataSetList: { $set: action.payload } });

		case "SET_RELATIONSHIP_ARRAY":
			return update(state, { relationships: { $set: action.payload } });

		case "SET_ARROWS":
			return update(state, { arrows: { $set: action.payload } });

		default:
			return state;
	}
};

export default DataSetReducer;
