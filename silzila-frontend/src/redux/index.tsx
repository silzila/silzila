import { combineReducers } from "redux";
import tabStateReducer from "./TabTile/tabState";

import loggedReducer from "./UserInfo/isLogged";

import tileStateReducer from "./TabTile/tileState";
import tabTilePropsReducer from "./TabTile/tabTileProps";
import DataSetReducer from "./DataSet/dataset";
// import SampleRecordsReducer from "./SampleTableRecords/sampleTableRecords";
import chartPropertiesState from "./ChartPoperties/ChartProperties";
import PlayBookReducer from "./PlayBook/PlayBook";
import chartControlsReducer from "./ChartPoperties/ChartControls";

const allReducers = combineReducers({
	isLogged: loggedReducer,
	dataSetState: DataSetReducer,

	tabState: tabStateReducer,
	tileState: tileStateReducer,
	tabTileProps: tabTilePropsReducer,

	chartProperties: chartPropertiesState,
	chartControls: chartControlsReducer,
	// sampleRecords: SampleRecordsReducer,
	playBookState: PlayBookReducer,
});

export default allReducers;
