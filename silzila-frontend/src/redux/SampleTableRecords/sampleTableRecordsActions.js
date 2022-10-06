export const addTableRecords = (ds_uid, tableId, tableRecords, columnType) => {
	return { type: "ADD_TABLE_RECORDS", payload: { ds_uid, tableId, tableRecords, columnType } };
};

// ==============================
// Reset state

export const resetSampleRecords = () => {
	return { type: "RESET_SAMPLE_RECORDS" };
};

export const loadSampleRecords = (sampleRecords) => {
	return { type: "LOAD_SAMPLE_RECORDS_FROM_PLAYBOOK", payload: sampleRecords };
};
