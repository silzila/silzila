import update from "immutability-helper";

const initialState = {
	playBookName: null,
	playBookUid: null,
	description: null,
	oldContent: null,
};

const PlayBookReducer = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_PLAYBOOK_UID":
			return update(state, {
				playBookUid: { $set: action.payload.pb_uid },
				playBookName: { $set: action.payload.name },
				description: { $set: action.payload.description },
				oldContent: { $set: action.payload.oldContent },
			});

		case "RESET_PLAYBOOK_DATA":
			return initialState;

		case "STORE_PLAYBOOK_COPY":
			return update(state, { oldContent: { $set: action.payload } });

		default:
			return state;
	}
};

export default PlayBookReducer;
