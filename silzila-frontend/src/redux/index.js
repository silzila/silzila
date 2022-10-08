import { combineReducers } from "redux";

import loggedReducer from "./UserInfo/isLogged";
import DataSetReducer from "./Dataset/dataset";

import tabStateReducer from "./TabTile/tabState";
import tileStateReducer from "./TabTile/tileState";
import tabTilePropsReducer from "./TabTile/tabTileProps";
import SampleRecordsReducer from "./SampleTableRecords/sampleTableRecords";
import chartPropertiesState from "./ChartProperties/chartProperties";
import chartControlsReducer from "./ChartProperties/chartControls";
import PlayBookReducer from "./Playbook/playbook";

const allReducers = combineReducers({
	isLogged: loggedReducer,
	dataSetState: DataSetReducer,

	tabState: tabStateReducer,
	tileState: tileStateReducer,
	tabTileProps: tabTilePropsReducer,

	chartProperties: chartPropertiesState,
	chartControls: chartControlsReducer,
	sampleRecords: SampleRecordsReducer,
	playBookState: PlayBookReducer,
});

export default allReducers;
