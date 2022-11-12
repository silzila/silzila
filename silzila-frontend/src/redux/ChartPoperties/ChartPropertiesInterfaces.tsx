export interface ChartPropProperties {
	[key: number]: {
		tabId: number;
		tileId: number;

		chartType: string;

		axesEdited: boolean;
		filterRunState: boolean;
		chartAxes: ChartPropChartAxes[];
		chartFilters: any[];
		selectedDs: any; //{}
		selectedTable: any; //{}
		titleOptions: ChartPropTitleOptions;
		chartOptionSelected: string;
	};
}

interface ChartPropChartAxes {
	name: string;
	fields: any[];
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
