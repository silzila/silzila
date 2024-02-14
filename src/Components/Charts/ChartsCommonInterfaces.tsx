import {
	ChartControl,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import {
	ChartPropertiesProps,
	ChartPropertiesStateProps,
} from "../../redux/ChartPoperties/ChartPropertiesInterfaces";

export interface ChartsReduxStateProps {
	propKey: string;
	graphDimension?: any;
	chartArea?: any;
	graphTileSize?: number;

	chartProperties: ChartPropertiesProps;
	chartControls: ChartControl;
}

export type ChartsMapStateToProps = ChartControlStateProps & ChartPropertiesStateProps;

export interface FormatterValueProps {
	componentType: string;
	componentSubType: string;
	componentIndex: number;
	seriesType: string;
	seriesIndex: number;
	seriesId: string;
	seriesName: string;
	name: string;
	dataIndex: number;
	data: any;
	dataType?: null | any;
	value: any;
	color: string;
	dimensionNames: string[];
	encode: any;
	$vars: string[];
	status: string;
	percent?: number;
	borderColor?: any;
	dimensionIndex?: any;
}

export interface ChartDataFieldProps {
	fieldname: string;
	displayname: string;
	dataType: string;
	tableId: string;
	uId: string;
	agg?: any;
}
