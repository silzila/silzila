export interface SampleRecordsStateProp {
	recordsColumnType: any;
}

export interface SampleRecordsState {
	sampleRecords: SampleRecordsStateProp;
}

export interface AddTableRecords {
	type: "ADD_TABLE_RECORDS";
	payload: { ds_uid: string | number; tableId: any; tableRecords: any; columnType: any };
}

export interface ResetSampleRecords {
	type: "RESET_SAMPLE_RECORDS";
}

export interface LoadSampleRecords {
	type: "LOAD_SAMPLE_RECORDS_FROM_PLAYBOOK";
	payload: any;
}
