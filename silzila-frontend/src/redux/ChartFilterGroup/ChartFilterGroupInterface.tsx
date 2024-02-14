import { Card } from "../../Components/ChartAxes/ChartAxesInterfaces";

export interface fieldProps {
	uId?: string;
	fieldname?: string;
	displayname?: string;
	dataType: string;
	prefix?: any;
	tableId?: string;
	agg?: any;
	timeGrain?: any;
}

export interface groupProp {
	id: string;
	name: string;
	filters: any;
	isCollapsed: boolean;
}

export interface ChartFilterGroupCardProps {
	token: string;
	name: string;
	field: fieldProps;
	propKey: string;
	itemIndex: number;

	chartProp: any;
	chartGroup: any;
	tabTileProps: any;

	updateChartFilterRightGroupsFilters: (groupName: string, filter: any) => void;
	deleteRightFilterGroupItems: (groupName: string, itemIndex: number) => void;
	sortRightFilterGroupItems: (name: string, dragUId: any, uId: any) => void;
	revertRightFilterGroupItems: (name: string, uId: any, originalIndex: any) => void;
}

export interface ChartFilterGroupProps {
	tabTile: any;
	datasetGroupsList: any;
	groups: any;
	chartFilterGroupEdited: boolean;
}

export interface ChartFilterGroupStateProps {
	chartFilterGroup: ChartFilterGroupProps;
}

export interface ChartFilterGroupsContainerProps {
	propKey: string;
	chartProp: any;
	chartGroup: any;
	fromDashboard: boolean;
	dashBoardGroup: any;
	tileState: any;
	tabTileProps: any;

	addChartFilterGroupName: (
		selectedDatasetID: string,
		groupId: string,
		groupName: string
	) => void;
	updateChartFilterGroupsCollapsed: (groupId: string, collapsed: boolean) => void;
	addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) => void;
	updateChartFilterSelectedGroups: (groupId: string, filters: any) => void;
	deleteChartFilterSelectedGroup: (tabTileName: string, groupIndex: number) => void;
	updateDashBoardGroups: (groupId: string) => void;
	deleteDashBoardSelectedGroup: (groupId: string) => void;
	addDashBoardFilterGroupTabTiles: (groupId: string) => void;
	setDashBoardFilterGroupsTabTiles: (groupId: string, selectedTabTiles: any) => void;
	deleteDashBoardSelectedGroupAllTabTiles: (groupId: string) => void;
}

export interface ChartFilterGroupsProps {
	propKey: string;
	group: groupProp;
	chartProp: any;
	tabState: any;
	chartGroup: any;
	fromDashboard: boolean;
	tileState: any;
	tabTileProps: any;
	dashBoardGroup: any;

	updateChartFilterGroupsFilters: (
		selectedDatasetID: string,
		groupId: string,
		filters: any
	) => void;
	updateChartFilterGroupsName: (groupId: string, name: string) => void;
	updateChartFilterGroupsCollapsed: (groupId: string, collapsed: boolean) => void;
	deleteDashBoardSelectedTabTiles: (groupId: string, groupIndex: number) => void;
	updateDashBoardSelectedTabTiles: (groupId: string, selectedTabTiles: any) => void;
}

export interface UserFilterCardProps extends Card {
	token: string;

	// dispatch
	deleteDropZoneItems: (propKey: string, binIndex: number, itemIndex: number) => void;

	updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any) => void;

	updateLeftFilterItem: (propKey: string, bIndex: number, item: any) => void;

	updtateFilterExpandeCollapse: (propKey: string, bIndex: number, item: any) => void;

	sortAxes: (propKey: string, bIndex: number, dragUId: any, uId: any) => void;
	revertAxes: (propKey: string, bIndex: number, uId: any, originalIndex: number) => void;
}
