import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../redux/TabTile/TabTilePropsInterfaces";

export interface ChartAxesProps {
	// props
	tabId: number;
	tileId: number;
	screenFrom: string;
	tabTileProps: TabTileStateProps;
	// state
	token: string;
	chartProp: any;
	chartGroup: any;
	dashBoardGroup: any;
	changeLocation: any;

	// dispatch
	updateChartData: (propKey: string, chartData: any) => void;
	toggleAxesEdit: (propKey: string) => void;
	reUseOldData: (propKey: string) => void;
	chartFilterGroupEdited: (isEdited: boolean) => void;
	dashBoardFilterGroupsEdited: (isEdited: boolean) => void;
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
	// 	timeGrain: TimeGrain[];
	// };
	// timestamp: {
	// 	timeGrain: TimeGrain[];
	// };
}

export interface MeasurePrefixes {
	[key: string]: any;

	// integer: TimeGrain[];
	// decimal: TimeGrain[];
	// text: TimeGrain[];
	// date: {
	// 	aggr: TimeGrain[];
	// 	timeGrain: TimeGrain[];
	// };
	// timestamp: {
	// 	aggr: TimeGrain[];
	// 	timeGrain: TimeGrain[];
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
	propKey: string;

	// state
	chartProp: ChartPropertiesProps;

	// dispatch
	clearDropZoneFieldsChartPropLeft: (propKey: string, bIndex: number) => void;
	updateDropZoneExpandCollapsePropLeft: (
		propKey: string,
		bIndex: number,
		isCollapsed: boolean
	) => void;
	updateFilterAnyContidionMatchPropLeft: (
		propKey: string,
		bIndex: number,
		any_condition_match: any
	) => void;
	updateIsAutoFilterEnabledPropLeft: (
		propKey: string,
		bIndex: number,
		is_auto_filter_enabled: any
	) => void;
	toggleFilterRunState: (propKey: string, runState: any) => void;
	updateDropZoneItems: (propKey: string, bIndex: number, item: any, allowedNumbers: any) => void;

	moveItemChartProp: (
		propKey: string,
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

export interface Card {
	field: {
		uId?: string;
		fieldname?: string;
		displayname?: string;
		dataType: string;
		prefix?: any;
		tableId?: string;
		agg?: any;
		timeGrain?: any;
	};
	bIndex: number;
	itemIndex: number;
	propKey: string;
	axisTitle: string;

	// state
	tabTileProps: TabTileStateProps;
	chartProp: ChartPropertiesProps;
	dynamicMeasureState: any;
}

export interface CardProps extends Card {
	// dispatch
	deleteDropZoneItems: (propKey: string, binIndex: number, itemIndex: number) => void;
	updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any) => void;
	sortAxes: (propKey: string, bIndex: number, dragUId: any, uId: any) => void;
	revertAxes: (propKey: string, bIndex: number, uId: any, originalIndex: number) => void;

	//dynamicMeasure dispatch
	deleteDropZoneItemsForDm: (propKey: string, binIndex: number, itemIndex: number) => void;
	updateAxesQueryParamForDm: (
		propKey: string,
		binIndex: number,
		itemIndex: number,
		item: any
	) => void;
	sortAxesForDm: (propKey: string, bIndex: number, dragUId: any, uId: any) => void;
	revertAxesForDm: (propKey: string, bIndex: number, uId: any, originalIndex: number) => void;
}

export interface AxesValuProps {
	name: string;
	fields: any[];
}
