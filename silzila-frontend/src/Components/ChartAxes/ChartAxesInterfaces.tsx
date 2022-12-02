import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../redux/TabTile/TabTilePropsInterfaces";

export interface ChartAxesProps {
	// props
	tabId: number;
	tileId: number;

	// state
	token: string;
	chartProp: any;

	// dispatch
	updateChartData: (propKey: number, chartData: any) => void;
	toggleAxesEdit: (propKey: number) => void;
	reUseOldData: (propKey: number) => void;
	changeLocation: any;
}
interface TimeGrain {
	name: string;
	id: string;
}
export interface DimensionPrefixesProps {
	[key: string]: any;
	// integer: any;
	// decimal: any[];
	// text: any[];
	// date: {
	// 	time_grain: TimeGrain[];
	// };
	// timestamp: {
	// 	time_grain: TimeGrain[];
	// };
}

export interface MeasurePrefixes {
	[key: string]: any;

	// integer: TimeGrain[];
	// decimal: TimeGrain[];
	// text: TimeGrain[];
	// date: {
	// 	aggr: TimeGrain[];
	// 	time_grain: TimeGrain[];
	// };
	// timestamp: {
	// 	aggr: TimeGrain[];
	// 	time_grain: TimeGrain[];
	// };
}

export interface AggregatorsProps {
	Dimension: DimensionPrefixesProps;
	Row: DimensionPrefixesProps;
	Column: DimensionPrefixesProps;
	Measure: MeasurePrefixes;
	X: MeasurePrefixes;
	Y: MeasurePrefixes;
	Distribution: DimensionPrefixesProps;
}

export interface AggregatorKeysProps {
	[key: string]: string;
	// avg: string;
	// min: string;
	// max: string;
	// count: string;
	// countnn: string;
	// countn: string;
	// countu: string;
	// year: string;
	// yearquarter: string;
	// yearmonth: string;
	// month: string;
	// quarter: string;
	// dayofmonth: string;
	// dayofweek: string;
	// date: string;
}

export interface DropZoneProps {
	bIndex: number;
	name: string;
	propKey: number;

	// state
	chartProp: ChartPropertiesProps;

	// dispatch
	clearDropZoneFieldsChartPropLeft: (propKey: number | string, bIndex: number) => void;
	updateDropZoneExpandCollapsePropLeft: (
		propKey: number | string,
		bIndex: number,
		isCollapsed: boolean
	) => void;
	updateFilterAnyContidionMatchPropLeft: (
		propKey: number | string,
		bIndex: number,
		any_condition_match: any
	) => void;
	updateIsAutoFilterEnabledPropLeft: (
		propKey: number | string,
		bIndex: number,
		is_auto_filter_enabled: any
	) => void;
	toggleFilterRunState: (propKey: number | string, runState: any) => void;
	updateDropZoneItems: (
		propKey: number | string,
		bIndex: number,
		item: any,
		allowedNumbers: any
	) => void;

	moveItemChartProp: (
		propKey: number | string,
		fromBIndex: any,
		fromUID: any,
		item: any,
		toBIndex: any,
		allowedNumbers: any
	) => void;
}

export interface DropZoneDropItem {
	fieldData: SetPrefixFieldData;
	name: string;
	type: string;
}

export interface SetPrefixFieldData {
	fieldname: string;
	displayname: string;
	dataType: string;
	tableId: string;
	uId: string;
}

export interface ChartAxesFormattedAxes {
	[key: string]: any[];
	// filters?: any[];
	// dimensions?: FormattedAxexDimentionsProps[];
	// measures?: FormattedAxexDimentionsProps[];
	// fields?: any[];
}

export interface CardProps {
	field: {
		uId?: string;
		fieldname?: string;
		displayname?: string;
		dataType: string;
		prefix?: any;
		tableId?: string;
		agg?: any;
		time_grain?: any;
	};
	bIndex: number;
	itemIndex: number;
	propKey: number;
	axisTitle: string;

	// state
	tabTileProps: TabTileStateProps;
	chartProp: ChartPropertiesProps;

	// dispatch
	deleteDropZoneItems: (propKey: number | string, binIndex: number, itemIndex: number) => void;

	updateQueryParam: (
		propKey: number | string,
		binIndex: number,
		itemIndex: number,
		item: any
	) => void;

	sortAxes: (propKey: number, bIndex: number, dragUId: any, uId: any) => void;
	revertAxes: (propKey: number, bIndex: number, uId: any, originalIndex: number) => void;
}

export interface AxesValuProps {
	name: string;
	fields: any[];
}
