import {
	ChartControl,
	ChartControlStateProps,
} from "../../../redux/ChartPoperties/ChartControlsInterface";
import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import {
	TabTileStateProps,
	TabTileStateProps2,
} from "../../../redux/TabTile/TabTilePropsInterfaces";

export interface ColorScaleProps {
	chartControls: ChartControl;
	tabTileProps: TabTileStateProps;

	// dispatch
	setColorScaleOption: (option: string, value: any, propKey: string | number) => void;
}

export type ColorScaleStateProps = ChartControlStateProps & TabTileStateProps2;

export type ChartColorsStateProps = ChartControlStateProps &
	TabTileStateProps2 &
	ChartPropertiesStateProps;

export interface ChartColorProps {
	//State
	chartControls: ChartControl;
	tabTileProps: TabTileStateProps;
	chartProperties: ChartPropertiesProps;
	//Dispatch
	setColorScheme: (propKey: string | number, color: string) => void;
	switchAutotoManualinSteps: (propKey: string | number, value: any) => void;
	setAreaColorOptions: (propKey: string | number, option: string, value: any) => void;
	updateBoxPlotStyleOptions: (propKey: string | number, option: string, value: any) => void;
}
