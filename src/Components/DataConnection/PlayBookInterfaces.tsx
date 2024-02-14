export interface PlayBookProps {
	token: string;

	setSelectedDataSetList: (dataset: PbSelectedDataset) => void;
	setTablesForDs: (tablesObj: any) => void;
	setSelectedDs: (propKey: string, selectedDs: any) => void;
	loadPlayBook: (playBook: any) => void;
	storePlayBookCopy: (pb: any) => void;
	// updateChartData: (propKey:string | string, chartData: string | any) => void;
	updatePlayBookId: (
		playBookName: string,
		playBookUid: string,
		description: string,
		oldContent?: string | any
	) => void;
}

export interface PbSelectedDataset {
	connectionId: string;
	datasetName: string;
	id: string;
	isFlatFileData: boolean;
}
