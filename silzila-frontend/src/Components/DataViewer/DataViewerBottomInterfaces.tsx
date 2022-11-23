import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
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
	setSelectedDs: (propKey: number, selectedDs: any) => void;
	setSelectedTable: (propKey: number, selectedTable: any) => void;
	addRecords: (ds_uid: string, tableId: string, tableRecords: any, columnType: any) => void;
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
	TabStateProps2 &
	isLoggedProps;
