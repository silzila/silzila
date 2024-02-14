import { DatasetItem } from "../../redux/DataSet/DatasetStateInterfaces";

export interface DatasetListProps {
	accessToken: string;
	tempTable: any;
	setDsId: (dsId: string) => void;
	setDataSetListToStore: (datasetList: DatasetItem[]) => void;
	resetState: () => void;
	setCreateDsFromFlatFile: (value: boolean) => void;
	setUserTable: (userTable: any) => void;
}
