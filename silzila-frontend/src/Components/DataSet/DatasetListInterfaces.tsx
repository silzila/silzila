export interface DatasetItem {
	id: string;
	connectionId: string;
	datasetName: string;
	isFlatFileData: boolean;
}

export interface DatasetProps {
	accessToken: string;
	setDsId: (dsId: string) => void;
	setDataSetListToStore: (datasetList: DatasetItem[]) => void;
	resetState: () => void;
}
