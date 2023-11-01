import update from "immutability-helper";

const initialDashBoardFilterGroup = {
    // dashBoard:{
    //    // {//propKey : []//groups}
    // }

    dashBoardGroupEdited: false,
    groups: [],
    filterGroupTabTiles:{}

}

const dashBoardFilterGroupReducer = (state: any = initialDashBoardFilterGroup, action: any) => {
    switch (action.type) {
        case "UPDATE_DASHBOARD_GROUPS":
            return update(state, {
                groups: {
                    $push: [action.payload.selectedGroups],
                },
                dashBoardGroupEdited: { $set: true }
            });

        case "DELETE_DASHBOARD_SELECTED_GROUP":
            let index = state.groups.findIndex((id: string) => id === action.payload.groupId);
            
            return update(state, {
                groups: {
                    $splice: [[index, 1]]
                },
                dashBoardGroupEdited: { $set: true }
            });

        case "ADD_DASHBOARD_FILTER_GROUPS_TABTILES":

            return {
                ...state,
                filterGroupTabTiles: {
                    ...state.filterGroupTabTiles,
                    [action.payload.groupId]: []
                },
                dashBoardGroupEdited: false
            }

            case "SET_DASHBOARD_FILTER_GROUPS_TABTILES":

            return update(state, {
                filterGroupTabTiles: {
                    [action.payload.groupId]: {
                        $set: action.payload.selectedTabTiles,
                    }
                },
                dashBoardGroupEdited: { $set: true }
            });

            case "DASHBOARD_FILTER_GROUP_EDITED":
                return update(state, {
                    dashBoardGroupEdited: { $set: action.payload.isEdited }
                });

            case "UPDATE_DASHBOARD_SELECTED_TABTILES":
                return update(state, {
                    filterGroupTabTiles: {
                        [action.payload.groupId]: {
                            $push: [action.payload.selectedTabTiles],
                        }
                    },
                    dashBoardGroupEdited: { $set: true }
                });

            case "DELETE_DASHBOARD_SELECTED_TABTILES":
                return update(state, {
                    filterGroupTabTiles: {
                        [action.payload.groupId]: { $splice: [[action.payload.groupIndex, 1]] }
                    },
                    dashBoardGroupEdited: { $set: true }
                });

            case "DELETE_DASHBOARD_SELECTED_GROUP_ALL_TABTILES":
                return update(state, {
                    filterGroupTabTiles: {
                        [action.payload.groupId]: { $set: [] }
                    },
                    dashBoardGroupEdited: { $set: true }
                });

        default:
            return state;
    }


}

export default dashBoardFilterGroupReducer;
