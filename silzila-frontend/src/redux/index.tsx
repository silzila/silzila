import { combineReducers } from "redux";

import loggedReducer from "./UserInfo/isLogged";

import tileStateReducer from "./TabTile/TileState";
import tabTilePropsReducer from "./TabTile/TabTileProps";
import DataSetReducer from "./DataSet/dataset";
// import SampleRecordsReducer from "./SampleTableRecords/sampleTableRecords";
import chartPropertiesState from "./ChartPoperties/ChartProperties";
import PlayBookReducer from "./PlayBook/PlayBook";
import chartControlsReducer from "./ChartPoperties/ChartControls";
import tabStateReducer from "./TabTile/TabState";

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
