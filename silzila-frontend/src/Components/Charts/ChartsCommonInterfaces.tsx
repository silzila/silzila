import {
	ChartControl,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";

export interface ChartsReduxStateProps {
	propKey: string | number;
	graphDimension: any;
	chartArea?: any;
	graphTileSize: number;

	chartProperties: ChartPropertiesProps;
	chartControls: ChartControl;
}

export type ChartsMapStateToProps = ChartControlStateProps & ChartPropertiesStateProps;
