import {
	ChartControl,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";

export type ChartOptionsStateProps = ChartControlStateProps &
	TabTileStateProps2 &
	ChartPropertiesStateProps;

export interface ChartOptionsProps {
	chartControls: ChartControl;
	tabTileProps: TabTileStateProps;
	chartProperties: ChartPropertiesProps;
}
