export const updateDashBoardGroups = ( selectedGroups: string) => {
	return {
		type: "UPDATE_DASHBOARD_GROUPS",
		payload: { selectedGroups },
	};
};

export const deleteDashBoardSelectedGroup = ( groupId: string) => {

	return {
		type: "DELETE_DASHBOARD_SELECTED_GROUP",
		payload: { groupId },
	};
};

export const addDashBoardFilterGroupTabTiles = ( groupId: string) => {
	return {
		type: "ADD_DASHBOARD_FILTER_GROUPS_TABTILES",
		payload: { groupId },
	};
};

export const setDashBoardFilterGroupsTabTiles = ( groupId: string, selectedTabTiles: any) => {
	return {
		type: "SET_DASHBOARD_FILTER_GROUPS_TABTILES",
		payload: { groupId, selectedTabTiles },
	};
};

export const updateDashBoardSelectedTabTiles = ( groupId: string, selectedTabTiles: any) => {
	return {
		type: "UPDATE_DASHBOARD_SELECTED_TABTILES",
		payload: { groupId, selectedTabTiles },
	};
};

export const deleteDashBoardSelectedTabTiles = ( groupId: string, groupIndex: number) => {
	return {
		type: "DELETE_DASHBOARD_SELECTED_TABTILES",
		payload: { groupId, groupIndex },
	};
};

export const deleteDashBoardSelectedGroupAllTabTiles = ( groupId: string) => {
	return {
		type: "DELETE_DASHBOARD_SELECTED_GROUP_ALL_TABTILES",
		payload: { groupId },
	};
};

export const dashBoardFilterGroupsEdited = ( isEdited : boolean) => {
	return {
		type: "DASHBOARD_FILTER_GROUP_EDITED",
		payload: { isEdited },
	};
};