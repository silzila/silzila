// =============================================================================
// Actions from Sidebar
// =============================================================================

import { useSelector } from "react-redux";

export const setConnectionValue = (pl) => {
	return { type: "SET_CONNECTION_VALUE", payload: pl };
};

export const setDsId = (pl) => {
	return { type: "SET_DS_ID", payload: pl };
};

export const setDataSchema = (pl) => {
	return { type: "SET_DATA_SCHEMA", payload: pl };
};

export const setUserTable = (userTable) => {
	return { type: "SET_TABLES", payload: userTable };
};

export const addTable = (payload) => {
	return { type: "ADD_TABLE", payload: payload };
};

export const toggleOnChecked = (data) => {
	return { type: "ON_CHECKED", payload: data };
};

export const removeArrows = (pl) => {
	return { type: "REMOVE_ARROWS", payload: pl };
};
export const resetState = () => {
	return { type: "RESET_STATE" };
};

export const setFriendlyName = (pl) => {
	return { type: "SET_FRIENDLY_NAME", payload: pl };
};

// =============================================================================
// Actions from Canvas
// =============================================================================
export const addArrows = (arrow) => {
	return { type: "ADD_ARROWS", payload: arrow };
};
export const clickOnArrow = (payload) => {
	return { type: "CLICK_ON_ARROW", payload: payload };
};
export const setArrowType = (payload) => {
	return { type: "SET_ARROW_TYPE", payload: payload };
};
export const setArrows = (pl) => {
	return { type: "SET_ARROWS", payload: pl };
};
export const resetArrows = () => {
	return { type: "RESET_ARROWS_ARRAY" };
};

export const removeArrowsFromcanvas = (payload) => {
	return { type: "REMOVE_ARROWS_FROM_DEL_REL", payload: payload };
};

export const removeIndiArrowFromRelPopover = (start, end) => {
	return { type: "REMOVE_INDI_ARROW_FROM_REL_POPOVER", payload: { start, end } };
};

export const updateRelationship = (relationId, relation) => {
	return { type: "UPDATE_RELATIONSHIP", payload: { relationId, relation } };
};

// ===============================================================
// Actions from Tables
// ===============================================================

export const addNewRelationship = (payload) => {
	return { type: "ADD_NEW_RELATIONSHIP", payload: payload };
};

export const removeRelationshipFromTableList = (payload) => {
	return { type: "DELETE_RELATIONSHIP_FROM_TABLELIST", payload: payload };
};

export const removeRelationshipFromCanvas = (payload) => {
	return { type: "DELETE_RELATIONSHIP_FROM_CANVAS", payload: payload };
};

// ===============================================================
// Add DatasetList from Datahome
// ===============================================================
export const setDatasetList = (payload) => {
	return { type: "SET_DATASET_LIST", payload };
};

// =====================================================================
// Actions from EditDs
// =====================================================================
export const setTempTables = (payload) => {
	return { type: "SET_TEMP_TABLES", payload };
};

export const setRelationship = (payload) => {
	return { type: "SET_RELATIONSHIP_ARRAY", payload };
};

export const setValuesToState = (payload) => {
	return (dispatch) => {
		dispatch(setConnectionValue(payload.conId));
		dispatch(setFriendlyName(payload.fname));
		dispatch(setArrows(payload.relationshipArray));
		dispatch(setDataSchema(payload.schema));
		dispatch(setTempTables(payload.canvasTables));
		dispatch(setArrows(payload.arrowsArray));
		dispatch(setRelationship(payload.relationshipsArray));
	};
};

export const actionsOnRemoveTable = ({ tempTables, tables, tableId }) => {
	//console.log("REMOVE TABLE FROM CANVAS", tempTables, tables, tableId);
	return (dispatch) => {
		dispatch(setTempTables(tempTables));
		dispatch(setUserTable(tables));
		dispatch(removeRelationshipFromTableList(tableId));
		dispatch(removeArrows(tableId));
	};
};
