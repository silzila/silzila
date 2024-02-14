import { combineReducers } from "redux";

import loggedReducer from "./UserInfo/isLogged";

import DataSetReducer from "./DataSet/dataset";
import SampleRecordsReducer from "./SampleTableRecords/SampleTableRecords";
import chartPropertiesState from "./ChartPoperties/ChartProperties";
import PlayBookReducer from "./PlayBook/PlayBook";
import chartControlsReducer from "./ChartPoperties/ChartControls";
import tabStateReducer from "./TabTile/TabState";
import tileStateReducer from "./TabTile/TileState";
import tabTilePropsReducer from "./TabTile/TabTileProps";
import FlatFileReducer from "./FlatFile/FlatFileState";
import DownloadPageSettingReducer from "./PageSettings/DownloadPageSettingState";
import chartFilterGroupReducer from "./ChartFilterGroup/ChartFilterGroupState";
import DynamicMeasureReducer from "./DynamicMeasures/DynamicMeasureState";
import dashBoardFilterGroupReducer from './DashBoardFilterGroup/DashBoardFilterGroupState';

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
	flatFileState: FlatFileReducer,
	pageSettings: DownloadPageSettingReducer,
	chartFilterGroup: chartFilterGroupReducer,
	dynamicMeasuresState: DynamicMeasureReducer,
	dashBoardFilterGroup: dashBoardFilterGroupReducer
});

export default allReducers;
