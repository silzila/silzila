import update from "immutability-helper";
import { ActionType, PlayBookProps } from "./PlayBookInterfaces";

const initialState = {
	playBookName: null,
	playBookUid: null,
	description: null,
	oldContent: null,
};

const PlayBookReducer = (state: PlayBookProps = initialState, action: ActionType) => {
	switch (action.type) {
		case "ADD_PLAYBOOK_UID":
			return update(state, {
				playBookUid: { $set: action.payload.playBookUid },
				playBookName: { $set: action.payload.playBookName },
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
