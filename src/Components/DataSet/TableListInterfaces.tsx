import { tableObjProps, UserTableProps } from "../../redux/DataSet/DatasetStateInterfaces";

export interface TableListProps {
	//props
	className: string;
	table: UserTableProps;
	tableId: string;
	xprops: any;
	isFlatFile: boolean;

	//state
	tempTable: tableObjProps[];
	tableList: UserTableProps[];
	token: string;
	connectionId: string;
	schema: string;
	databaseName: string;
	serverName: string;
	viewList: any[];

	//dispatch
	onChecked: (id: string | number) => void;
	toggleOnCheckedOnView: (id: string | number) => void;
	removeArrows: (id: string | number) => void;
	removeRelationship: (id: string | number) => void;
	addTable: (tabObj: any) => void;
}

export interface tabObj {
	isView?: boolean;
	id: string;
	table_uid: string;
	tableName: string;
	isSelected: boolean;
	alias: string;
	columns: any[];
	dcId: string;
	schema: string;
	databaseName: string;
	isNewTable: boolean;
	tablePositionX: number;
	tablePositionY: number;
}
