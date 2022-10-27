import { RelationObjProps } from "../../Components/DataSet/CanvasInterfaces";
import { DatasetItem } from "../../Components/DataSet/DatasetListInterfaces";
import { tableObjProps } from "../../Components/DataSet/SidebarInterfaces";

export interface DatasetProps {
	dsId: string;
	connection: string;
	schema: string;
	tables: UserTableProps[];
	arrows: ArrowsProps[];
	tempTable: tableObjProps[];
	relationships: RelationshipsProps[];
	dataSetList: DatasetItem[];
	datasetName: string;

	databaseName: string;
	serverName: string;
}

export interface DataSetStateProps {
	dataSetState: DatasetProps;
}

export interface ArrowsProps {
	cardinality: string;
	end: string;
	endColumnName: string;
	endId: string;
	endSchema: string;
	endTableName: string;
	integrity: string;
	isSelected: boolean;
	relationId: string;
	showHead: boolean;
	showTail: boolean;
	start: string;
	startColumnName: string;
	startId: string;
	startSchema: string;
	startTableName: string;
	table1_uid: string;
	table2_uid: string;
}

export interface RelationshipsProps {
	startId: string;
	endId: string;
	integrity: string;
	cardinality: string;
	showHead: boolean;
	showTail: boolean;
	relationId: string;
}

export interface UserTableProps {
	id: string;
	isNewTable: boolean;
	isSelected: boolean;
	tableName: string;
	table_uid: string;
}

interface SetDatabaseNametoState {
	type: "SET_DATABASE_NAME";
	payload: string;
}

interface SetServerName {
	type: "SET_SERVER_NAME";
	payload: string;
}

interface SetConnectionValue {
	type: "SET_CONNECTION_VALUE";
	payload: string;
}

interface SetDsId {
	type: "SET_DS_ID";
	payload: string;
}

interface setDatasetName {
	type: "SET_DATASET_NAME";
	payload: string;
}

interface SetDataSchema {
	type: "SET_DATA_SCHEMA";
	payload: string;
	// payload:{schemaName:string}
}

// TODO: need to specify type

interface SetUserTable {
	type: "SET_TABLES";
	payload: UserTableProps[];
}

interface SetTempTables {
	type: "SET_TEMP_TABLES";
	payload: tableObjProps[];
}

// TODO

interface AddTable {
	type: "ADD_TABLE";
	payload: tableObjProps;
}
// TODO
interface ToggleOnChecked {
	type: "ON_CHECKED";
	payload: string | number;
}
// TODO
interface RemoveArrows {
	type: "REMOVE_ARROWS";
	payload: string | number;
}
interface ResetState {
	type: "RESET_STATE";
}

// TODO
interface AddArrows {
	type: "ADD_ARROWS";
	payload: any;
}
// TODO
interface ClickOnArrow {
	type: "CLICK_ON_ARROW";
	payload: any;
}

// interface setArrowType = (payload) => {
// 	 type: "SET_ARROW_TYPE", payload: payload };
// };

interface SetArrows {
	type: "SET_ARROWS";
	payload: any[];
}
interface ResetArrows {
	type: "RESET_ARROWS_ARRAY";
}

interface RemoveArrowsFromcanvas {
	type: "REMOVE_ARROWS_FROM_DEL_REL";
	payload: string | number;
}

interface RemoveRelationshipFromTableList {
	type: "DELETE_RELATIONSHIP_FROM_TABLELIST";
	relationId: string | number;
}

interface setDatasetList {
	type: "SET_DATASET_LIST";
	payload: DatasetItem[];
}

interface AddNewRelationship {
	type: "ADD_NEW_RELATIONSHIP";
	payload: RelationObjProps;
}

interface RemoveIndiArrowFromRelPopover {
	type: "REMOVE_INDI_ARROW_FROM_REL_POPOVER";
	payload: { start: string; end: string };
}

interface RemoveRelationshipFromCanvas {
	type: "DELETE_RELATIONSHIP_FROM_CANVAS";
	payload: any;
}
interface UpdateRelationship {
	type: "UPDATE_RELATIONSHIP";
	payload: { relationId: any; relation: any };
}

interface SetRelationship {
	type: "SET_RELATIONSHIP_ARRAY";
	payload: any;
}

interface SetArrowType {
	type: "SET_ARROW_TYPE";
	payload: any;
}

export type ActionTypeOfDataSet =
	| SetConnectionValue
	| SetArrowType
	| UpdateRelationship
	| RemoveRelationshipFromCanvas
	| RemoveIndiArrowFromRelPopover
	| AddNewRelationship
	| RemoveRelationshipFromTableList
	| SetDsId
	| SetDataSchema
	| SetTempTables
	| SetRelationship
	| SetUserTable
	| AddTable
	| ToggleOnChecked
	| RemoveArrows
	| ResetState
	| setDatasetName
	| AddArrows
	| ClickOnArrow
	| setDatasetList
	| SetArrows
	| ResetArrows
	| SetServerName
	| SetDatabaseNametoState
	| RemoveArrowsFromcanvas;
