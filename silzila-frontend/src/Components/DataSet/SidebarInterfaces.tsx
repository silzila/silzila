import { UserTableProps } from "../../redux/DataSet/DatasetStateInterfacse";

export interface SidebarProps {
	//props
	editMode?: boolean;

	//stateProps
	token: string;
	tableList: UserTableProps[] | [];
	tempTable: tableObjProps[];
	connectionValue: string;
	schemaValue: string;
	databaseName: string;
	serverName: string;

	//dispatchProps
	setUserTable: (userTable: UserTableProps[]) => void;
	setDataSchema: (schema: string) => void;
	setConnection: (connection: string) => void;
	setServerName: (name: string) => void;
	setDatabaseNametoState: (name: string) => void;
}

export interface tableObjProps {
	id: string;
	table_uid: string;
	tableName: string;
	isSelected: boolean;
	alias: string;
	columns: any[];
	dcId: string;
	schema: string;
	isNewTable: boolean;
	tablePositionX: number;
	tablePositionY: number;
}
