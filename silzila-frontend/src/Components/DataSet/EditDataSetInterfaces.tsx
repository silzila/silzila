import {
	ArrowsProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";

export interface EditDatasetProps {
	//state
	token: string;
	dsId: string;
	databaseName: string;

	//dispatch
	setValuesToState: (
		conId: string,
		fname: string,
		canvasTables: tableObjProps[],
		schema: string,
		relationshipsArray: RelationshipsProps[],
		arrowsArray: ArrowsProps[]
	) => void;
	setServerName: (name: string) => void;
	setDatabaseNametoState: (name: string) => void;
	setUserTable: (payload: UserTableProps[]) => void;
	setViews: (payload: any[]) => void;
}
