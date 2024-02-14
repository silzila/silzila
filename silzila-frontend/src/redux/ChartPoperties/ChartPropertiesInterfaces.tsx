import { TabTilPropsSelectedDatasetList } from "../TabTile/TabTilePropsInterfaces";

export interface IndChartPropProperties {
	tabId: number;
	tileId: number;

	chartType: string;
	isDynamicMeasureWindowOpened: boolean;
	addMeasureInTextEditor: boolean;

	axesEdited: boolean;
	filterRunState: boolean;
	chartAxes: ChartPropChartAxes[];
	chartFilters: any[];
	selectedDs: TabTilPropsSelectedDatasetList | any; //{}
	selectedTable: any;
	titleOptions: ChartPropTitleOptions;
	chartOptionSelected: string;
	reUseData?: boolean;
}
export interface ChartPropProperties {
	[key: string]: IndChartPropProperties;
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
	timeGrain?: string;
	agg?: string;
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

	propList: { [key: string]: string[] };
}

export interface ChartPropertiesStateProps {
	chartProperties: ChartPropertiesProps;
}

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
ACTIONS INTERFACES
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

interface AddProp {
	type: "ADD_NEW_PROP_FROM_TAB" | "ADD_NEW_PROP";
	payload: {
		tabId: number;
		tileId: number;
		table: any;
		newTab: boolean;
		selectedDs: TabTilPropsSelectedDatasetList;
		selectedTablesInDs: any;
	};
}
interface DuplicateChartProperty {
	type: "DUPLICATE_CHART_PROP";
	payload: { propKey: string; chartProperty: any };
}

interface RemoveChartProperties {
	type: "DELETE_PROP";
	payload: { tabId: number; tileId: number; propKey: string; tileIndex: number };
}

interface RemoveMultipleChartProperties {
	type: "DELETE_PROPS_OF_TAB";
	payload: number;
}

interface SetSelectedDsInTile {
	type: "SET_SELECTED_DS_IN_TILE";
	payload: { propKey: string; selectedDs: any };
}

interface SetSelectedTableInTile {
	type: "SET_SELECTED_TABLE_IN_TILE";
	payload: { propKey: string; selectedTable: any };
}

interface UpdateDropZoneExpandCollapsePropLeft {
	type: "UPDATE_DROPZONE_EXPAND_COLLAPSE";
	payload: { propKey: string; bIndex: string | number; isCollapsed: boolean };
}

interface UpdateFilterAnyContidionMatchPropLeft {
	type: "UPDATE_FILTER_ANY_CONDITION_MATCH";
	payload: { propKey: string; bIndex: number | string; any_condition_match: any };
}

interface UpdateIsAutoFilterEnabledPropLeft {
	type: "UPDATE_IS_AUTO_FILTER_ENABLED";
	payload: { propKey: string; bIndex: number | string; is_auto_filter_enabled: any };
}

interface ClearDropZoneFieldsChartPropLeft {
	type: "CLEAR_DROPZONE_FIELDS";
	payload: { propKey: string; bIndex: number | string };
}

interface UpdateChartPropLeft {
	type: "UPDATE_PROP";
	payload: { propKey: string; bIndex: number; item: any; allowedNumbers: any };
}

interface MoveItemChartProp {
	type: "MOVE_ITEM";
	payload: {
		propKey: string;
		fromBIndex: any;
		fromUID: any;
		item: any;
		toBIndex: any;
		allowedNumbers: any;
	};
}

interface DeleteItemInChartProp {
	type: "DELETE_ITEM_FROM_PROP";
	payload: {
		propKey: string;
		binIndex: number;
		itemIndex: number;
	};
}

interface UpdateAxesQueryParam {
	type: "UPDATE_AXES_QUERY_PARAM";
	payload: {
		propKey: string;
		binIndex: number;
		itemIndex: number;
		item: any;
	};
}

interface ToggleAxesEdited {
	type: "TOGGLE_AXES_EDITED";
	payload: { propKey: string; axesEdited: any };
}

interface ToggleFilterRunState {
	type: "TOGGLE_FILTER_RUN_STATE";
	payload: { propKey: string; filterRunState: any };
}

interface ChangeChartType {
	type: "CHANGE_CHART_TYPE";
	payload: { propKey: string; chartType: string };
}

interface ChangeChartAxes {
	type: "CHANGE_CHART_AXES";
	payload: { propKey: string; newAxes: any };
}

interface CanReUseData {
	type: "REUSE_DATA";
	payload: { propKey: string; reUseData: boolean | any };
}

interface SetChartTitle {
	type: "SET_CHART_TITLE";
	payload: { propKey: string; title: string };
}

interface SetGenerateTitle {
	type: "SET_GENERATE_TITLE";
	payload: { propKey: string; generateTitle: any };
}

interface SetTitleAlignment {
	type: "SET_TITLE_ALIGN";
	payload: { propKey: string; align: string };
}
interface SetTitleSize {
	type: "SET_TITLE_SIZE";
	payload: { propKey: string; value: number };
}

interface SortAxes {
	type: "SORT_ITEM";
	payload: {
		propKey: string;
		bIndex: number;
		dragUId: string | number;
		dropUId: string | number;
	};
}

interface RevertAxes {
	type: "REVERT_ITEM";
	payload: {
		propKey: string;
		bIndex: number;
		uId: string | number;
		originalIndex: any;
	};
}

interface ChangeChartOptionSelected {
	type: "CHANGE_CHART_OPTION";
	payload: { propKey: string; chartOption: any; chartValue: any };
}

interface LoadChartProperties {
	type: "LOAD_CHART_PROPERTIES";
	payload: any;
}

// ==============================
// Reset state

interface ResetChartProperties {
	type: "RESET_CHART_PROPERTY";
}

interface UpdateLeftFilterItem {
	type: "UPDATE_LEFT_FILTER_ITEM";
	payload: { propKey: string; bIndex: number; item: any };
}
interface UpdtateFilterExpandeCollapse {
	type: "UPDATE_FILTER_EXPAND_COLLAPSE";
	payload: { propKey: string; bIndex: number | string; item: any };
}

export type ChartPropertiesActionsProps =
	| AddProp
	| DuplicateChartProperty
	| RemoveChartProperties
	| RemoveMultipleChartProperties
	| SetSelectedDsInTile
	| SetSelectedTableInTile
	| UpdateDropZoneExpandCollapsePropLeft
	| UpdateFilterAnyContidionMatchPropLeft
	| UpdateIsAutoFilterEnabledPropLeft
	| ClearDropZoneFieldsChartPropLeft
	| UpdateChartPropLeft
	| MoveItemChartProp
	| DeleteItemInChartProp
	| UpdateAxesQueryParam
	| ToggleAxesEdited
	| ToggleFilterRunState
	| ChangeChartType
	| ChangeChartAxes
	| CanReUseData
	| SetChartTitle
	| SetGenerateTitle
	| SetTitleAlignment
	| SetTitleSize
	| SortAxes
	| RevertAxes
	| ChangeChartOptionSelected
	| LoadChartProperties
	| ResetChartProperties
	| UpdateLeftFilterItem
	| UpdtateFilterExpandeCollapse;
