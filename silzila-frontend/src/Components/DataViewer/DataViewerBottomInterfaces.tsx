import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import {
	SampleRecordesColumnType,
	SampleRecordsState,
} from "../../redux/SampleTableRecords/SampleTableRecordsInterfaces";
import { TabStateProps, TabStateProps2 } from "../../redux/TabTile/TabStateInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";

export interface DataViewerBottomProps {
	//state
	token: string;
	tabTileProps: TabTileStateProps;
	chartProps: ChartPropertiesProps;
	sampleRecords: any;
	tabState: TabStateProps;
	//Dispatch
	setSelectedDataSetList: (dataset: string) => void;
	setTablesForDs: (tablesObj: any) => void;
	setSelectedDs: (propKey: string, selectedDs: any) => void;
	setSelectedTable: (propKey: string, selectedTable: any) => void;
	addRecords: (
		ds_uid: string,
		tableId: string,
		tableRecords: any[],
		columnType: SampleRecordesColumnType[]
	) => void;
	addTile: (
		tabId: number,
		nextTileId: number,
		table: any,
		selectedDataset: any,
		selectedTables: any
	) => void;
}

export type DataViewerBottomStateProps = TabTileStateProps2 &
	ChartPropertiesStateProps &
	SampleRecordsState &
	TabStateProps2 &
	isLoggedProps;
