import {
	ArrowsProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";

export interface CanvasTablesProps {
	// props
	tableData: tableObjProps;
	editMode: boolean;

	// state
	// dataSetState: DatasetProps;
	tempTable: tableObjProps[];
	arrows: ArrowsProps[];
	relationships: RelationshipsProps[];
	tables: UserTableProps[];
	views: any[];
	dsId: string;

	// dispatch
	addNewRelationship: (payload: RelationObjProps) => void;
	addArrows: (pl: any) => void;
	actionsOnRemoveTable: (
		tempTable: tableObjProps[],
		tables: UserTableProps[],
		tableId: string
	) => void;
	setTempTables: (temptable: tableObjProps[],calledFrm?:string) => void;
}

export interface RelationObjProps {
	cardinality: string;
	endId: string;
	endTableName: string;
	integrity: string;
	relationId: string;
	showHead: boolean;
	showTail: boolean;
	startId: string;
	startTableName: string;
}