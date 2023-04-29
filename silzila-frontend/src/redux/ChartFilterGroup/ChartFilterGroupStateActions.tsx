export const addChartFilterGroupName = (dataSetName: string, groupId: string, groupName: string) => {
	return {
		type: "ADD_CHART_FILTER_GROUPNAME",
		payload: { dataSetName, groupId, groupName },
	};
};

export const addChartFilterTabTileName = (dataSetName: string, tabTileName: string) => {
	return {
		type: "ADD_CHART_FILTER_TABTILENAME",
		payload: { dataSetName, tabTileName },
	};
};

export const updateChartFilterGroupsFilters = (dataSetName: string, groupId: string, filters: any) => {
	return {
		type: "UPDATE_CHART_FILTER_GROUPS_FILTERS",
		payload: { dataSetName, groupId, filters },
	};
};

export const updateChartFilterRightGroupsFilters = (groupId: string, item: any) => {
	return {
		type: "UPDATE_CHART_FILTER_RIGHT_GROUPS_FILTERS",
		payload: { groupId, item },
	};
};


export const updateChartFilterGroupsName = (groupId: string, name: string) => {
	return {
		type: "UPDATE_CHART_FILTER_GROUPS_NAME",
		payload: { groupId, name },
	};
};

export const updateChartFilterGroupsCollapsed = (groupId: string, collapsed: boolean) => {
	return {
		type: "UPDATE_CHART_FILTER_GROUPS_COLLAPSED",
		payload: { groupId, collapsed },
	};
};

export const updateChartFilterSelectedGroups = ( tabTileName: string, selectedGroups: any) => {
	return {
		type: "UPDATE_CHART_FILTER_SELECTED_GROUPS",
		payload: { tabTileName, selectedGroups },
	};
};

export const duplicateChartFilterGroups = ( tabTileName: string, selectedGroups: any) => {
	return {
		type: "DUPLICATE_CHART_FILTER_GROUPS",
		payload: { tabTileName, selectedGroups },
	};
};

export const deleteChartFilterSelectedGroup = ( tabTileName: string, groupIndex: number) => {
	return {
		type: "DELETE_CHART_FILTER_SELECTED_GROUP",
		payload: { tabTileName, groupIndex },
	};
};


export const deleteRightFilterGroupItems = (groupId: string, itemIndex: number) => {
	return {
		type: "DELETE_RIGHT_FILTER_GROUP_ITEM",
		payload: { groupId, itemIndex },
	};
};

export const chartFilterGroupEdited = (isEdited : boolean) => {
	return {
		type: "CHART_FILTER_GROUP_EDITED",
		payload: { isEdited },
	};
};


export const sortRightFilterGroupItems = (
	groupId: string,
	dragUId: string | number,
	dropUId: string | number
) => {
	return {
		type: "SORT_RIGHT_FILTER_GROUP_ITEMS",
		payload: { groupId, dragUId, dropUId },
	};
};

export const revertRightFilterGroupItems = (
	groupId: string,
	uId: string | number,
	originalIndex: any
) => {
	return {
		type: "REVERT_RIGHT_FILTER_GROUP_ITEMS",
		payload: { groupId, uId, originalIndex },
	};
};

export const loadReportFilterGroup = (chartFilterGroup: any) => {
	return { type: "LOAD_REPORT_FILTER_GROUP", payload: chartFilterGroup };
};