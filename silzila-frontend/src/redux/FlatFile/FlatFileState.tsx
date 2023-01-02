import update from "immutability-helper";
import { FlatFileActions, FlatFileState } from "./FlatFileInterfaces";

const initialState = {
	initialApiResponse: {},
	editApiResponse: {},
	confirmModifiedResponse: {},
};

const FlatFileReducer = (state: FlatFileState = initialState, action: FlatFileActions) => {
	switch (action.type) {
		case "SET_API_RESPONSE": {
			return update(state, { initialApiResponse: { $set: action.payload } });
		}
		case "SET_EDIT_API_RESPONSE":
			return update(state, { editApiResponse: { $set: action.payload } });
		case "EDIT_API_RESPONSE_PROP":
			return update(state, {
				editApiResponse: {
					[action.payload.key]: {
						$set: action.payload.file,
					},
				},
			});
		case "CONFIRM_MODIFIED_RESPONSE":
			return update(state, { confirmModifiedResponse: { $set: action.payload } });
		case "RESET_STATE":
			return (state = initialState);
		default:
			return state;
	}
};

export default FlatFileReducer;
