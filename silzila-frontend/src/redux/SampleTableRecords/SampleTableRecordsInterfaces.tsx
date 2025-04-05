export interface SampleRecordsStateProp {
	recordsColumnType: StateType;
	// [key: string]: {
	// 	[key: string]: any[];
	// };
}

export interface StateType {
	[key: string]: {
		[key: string]: SampleRecordesColumnType[];
	};
}

export interface SampleRecordsState {
	sampleRecords: SampleRecordsStateProp;
}

export interface SampleRecordesColumnType {
	columnName: string;
	dataType: string;
}

export interface AddTableRecords {
	type: "ADD_TABLE_RECORDS";
	payload: {
		ds_uid: string;
		tableId: string;
		tableRecords: any[];
		columnType: SampleRecordesColumnType[];
	};
}

export interface ResetSampleRecords {
	type: "RESET_SAMPLE_RECORDS";
}

export interface LoadSampleRecords {
	type: "LOAD_SAMPLE_RECORDS_FROM_PLAYBOOK";
	payload: any;
}

export interface DeleteTableRecords {
	type: "DELETE_TABLE_RECORDS";
	payload: {
		ds_uid: string;
		tableId: string;
	};
}