import { DatasetItem } from "../../redux/DataSet/DatasetStateInterfacse";

export interface DatasetListProps {
	accessToken: string;
	setDsId: (dsId: string) => void;
	setDataSetListToStore: (datasetList: DatasetItem[]) => void;
	resetState: () => void;
}
