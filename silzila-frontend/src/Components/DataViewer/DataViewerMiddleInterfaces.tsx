import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";

export interface DataViewerMiddleProps {
	// props
	tabId: number;
	tileId: number;

	// state
	tabTileProps: TabTileStateProps;
	chartProp: ChartPropertiesProps;

	// dispatch
	setMenu: (menu: string) => void;
}

export type DataViewerMiddleStateProps = ChartPropertiesStateProps & TabTileStateProps2;
