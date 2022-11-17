import { TabTilPropsSelectedDatasetList } from "../TabTile/TabTilePropsInterfaces";

export interface IndChartPropProperties {
	tabId: number;
	tileId: number;

	chartType: string;

	axesEdited: boolean;
	filterRunState: boolean;
	chartAxes: ChartPropChartAxes[];
	chartFilters: any[];
	selectedDs: TabTilPropsSelectedDatasetList; //{}
	selectedTable: any; //{"key":"jfj"}
	titleOptions: ChartPropTitleOptions;
	chartOptionSelected: string;
	reUseData?: boolean;
}
export interface ChartPropProperties {
	[key: number]: IndChartPropProperties;
}

interface ChartPropChartAxesFieldsProps {
	fieldname: string;
	displayname: string;
	dataType: string;
	tableId: string;
	uId: string;
	includeexclude: string;
	fieldtypeoption: string;
	isCollapsed: boolean;
	rawselectmembers: string[];
	userSelection: string[];
}

interface ChartPropChartAxes {
	name: string;
	fields: ChartPropChartAxesFieldsProps[];
	isCollapsed: boolean;
	any_condition_match?: boolean;
	is_auto_filter_enabled?: boolean;
}

interface ChartPropTitleOptions {
	fontSize: number;
	titleLeftPadding: string;
	titleAlign: string;
	chartTitle: string;
	generateTitle: string;
}

export interface ChartPropertiesProps {
	properties: ChartPropProperties;

	propList: { [key: number]: string[] };
}

export interface ChartPropertiesStateProps {
	chartProperties: ChartPropertiesProps;
}
