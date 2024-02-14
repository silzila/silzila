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
	setCreateDsFromFlatFile: (value: boolean) => void;
}
export interface CanvasIndividualTableProps {
	id: string;
	database: string;
	schema: string;
	table: string;
	alias: string;
	tablePositionX: number;
	tablePositionY: number;
}
