import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";

export interface DataViewerMiddleProps {
	// props
	tabId: number;
	tileId: number;
	setCallForDownload: (value: boolean) => void;
	callForDownload: boolean;

	// state
	tabTileProps: TabTileStateProps;
	chartProp: ChartPropertiesProps;

	// dispatch
	setMenu: (menu: string) => void;

	//for download page option
	orientation: any;
	unit: any;
	pageSize: any;
	height: any;
	width: any;
	setOrientation: (value: any) => void;
	setUnit: (value: any) => void;
	setPageSize: (value: any) => void;
	setHeight: (value: any) => void;
	setWidth: (value: any) => void;
}

export type DataViewerMiddleStateProps = ChartPropertiesStateProps & TabTileStateProps2;
