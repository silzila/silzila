import update from "immutability-helper";
import {
	AddTableRecords,
	LoadSampleRecords,
	ResetSampleRecords,
} from "./SampleTableRecordsInterfaces";

const initialRecords = { recordsColumnType: {} };

const SampleRecordsReducer = (
	state: any = initialRecords,
	action: AddTableRecords | ResetSampleRecords | LoadSampleRecords
) => {
	switch (action.type) {
		case "ADD_TABLE_RECORDS":
			if (state[action.payload.ds_uid] !== undefined) {
				return update(state, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
					recordsColumnType: {
						[action.payload.ds_uid]: {
							[action.payload.tableId]: { $set: action.payload.columnType },
						},
					},
				});
			} else {
				var stateCopy = Object.assign(state);
				var dsObj = { [action.payload.ds_uid]: {} };

				stateCopy = update(stateCopy, { $merge: dsObj });
				stateCopy = update(stateCopy, { recordsColumnType: { $merge: dsObj } });


				return update(stateCopy, {
					[action.payload.ds_uid]: {
						[action.payload.tableId]: { $set: action.payload.tableRecords },
					},
					recordsColumnType: {
						[action.payload.ds_uid]: {
							[action.payload.tableId]: { $set: action.payload.columnType },
						},
					},
				});
			}

		case "LOAD_SAMPLE_RECORDS_FROM_PLAYBOOK":
			return action.payload;

		case "RESET_SAMPLE_RECORDS":
			return initialRecords;

		default:
			return state;
	}
};

export default SampleRecordsReducer;
