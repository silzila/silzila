import {
	ConnectionItem,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";

export interface SidebarProps {
	//props
	editMode?: boolean;

	//stateProps
	token: string;
	tableList: UserTableProps[];
	tempTable: tableObjProps[];
	connectionValue: string;
	schemaValue: string;
	databaseName: string;
	serverName: string;
	views: any[];
	dataConnectionList: ConnectionItem[];
	isFlatFile: boolean;

	//dispatchProps
	setUserTable: (userTable: UserTableProps[]) => void;
	setDataSchema: (schema: string) => void;
	setConnection: (connection: string) => void;
	setServerName: (name: string) => void;
	setDatabaseNametoState: (name: string) => void;
	setViews: (views: any[]) => void;
}
