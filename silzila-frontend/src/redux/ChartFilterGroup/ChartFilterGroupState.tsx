import update from "immutability-helper";

const initialChartFilterGroup = {
    tabTile: {
        // tab_tile_name:{
        //   selectedGroups:[]
        // }
    },
    datasetGroupsList: [],
    groups: {

    },
    // dashBoard:{
    //    // {//propKey : []//groups}
    // }
}



const chartFilterGroupReducer = (state: any = initialChartFilterGroup, action: any) => {

    const findCardIndex = (groupId: string, fromUid: any) => {
        var removeIndex = state.groups[groupId].filters.findIndex(
            (obj: any) => obj.uId === fromUid
        );
        return removeIndex;
    };


    const findCardObject = (groupId: string, fromUid: any) => {
        var cardIndex = state.groups[groupId].filters.findIndex(
            (obj: any) => obj.uId === fromUid
        );
        var card = state.groups[groupId].filters[cardIndex];

        return {
            cardIndex,
            card,
        };
    };

    switch (action.type) {
        case "LOAD_REPORT_FILTER_GROUP":
            return action.payload;

        case "ADD_CHART_FILTER_GROUPNAME":

            return {
                ...state,
                groups: {
                    ...state.groups,
                    [action.payload.groupId]: {
                        filters: [],
                        name: action.payload.groupName,
                        isCollapsed: false,
                        dataSetId: action.payload.dataSetName
                    }
                },
                datasetGroupsList: {
                    ...state.datasetGroupsList,
                    [action.payload.dataSetName]: [...state.datasetGroupsList[action.payload.dataSetName], action.payload.groupId],
                }
            }

        case "ADD_CHART_FILTER_TABTILENAME":

            let initializeDatasetGroupsList = state.datasetGroupsList[action.payload.dataSetName] === undefined ? [] :
                state.datasetGroupsList[action.payload.dataSetName];

            return {
                ...state,
                tabTile: {
                    ...state.tabTile,
                    [action.payload.tabTileName]: []

                },
                datasetGroupsList: {
                    ...state.datasetGroupsList,
                    [action.payload.dataSetName]: initializeDatasetGroupsList
                },
                chartFilterGroupEdited: false
            }

        case "UPDATE_CHART_FILTER_GROUPS_FILTERS":
            return update(state, {
                groups: {
                    [action.payload.groupId]:
                    {
                        filters: { $push: [action.payload.filters] },
                    },
                },
               // chartFilterGroupEdited: { $set: true }
            });

        case "CHART_FILTER_GROUP_EDITED":
            return update(state, {
                chartFilterGroupEdited: { $set: action.payload.isEdited }
            });


        case "UPDATE_CHART_FILTER_RIGHT_GROUPS_FILTERS":
            var cardIndex = findCardIndex(
                action.payload.groupId,
                action.payload.item.uId
            );

            return update(state, {
                groups: {
                    [action.payload.groupId]: {
                        filters: {
                            $splice: [[cardIndex, 1, action.payload.item]],
                        },
                    },
                },
                chartFilterGroupEdited: { $set: true }
            });

        case "DELETE_RIGHT_FILTER_GROUP_ITEM":
            return update(state, {
                groups: {
                    [action.payload.groupId]: {
                        filters: { $splice: [[action.payload.itemIndex, 1]] },
                    },
                },
                chartFilterGroupEdited: { $set: true }
            });

        case "UPDATE_CHART_FILTER_GROUPS_NAME":
            return update(state, {
                groups: {
                    [action.payload.groupId]:
                    {
                        name: { $set: action.payload.name },
                    },
                },
            });

        case "UPDATE_CHART_FILTER_GROUPS_COLLAPSED":
            return update(state, {
                groups: {
                    [action.payload.groupId]:
                    {
                        isCollapsed: { $set: action.payload.collapsed },
                    },
                },
            });

        case "UPDATE_CHART_FILTER_SELECTED_GROUPS":
            return update(state, {
                tabTile: {
                    [action.payload.tabTileName]: {
                        $push: [action.payload.selectedGroups],
                    }
                },
                chartFilterGroupEdited: { $set: true }
            });

        case "DUPLICATE_CHART_FILTER_GROUPS":
            return update(state, {
                tabTile: {
                    [action.payload.tabTileName]: {
                        $set: [action.payload.selectedGroups],
                    }
                },
                chartFilterGroupEdited: { $set: true }
            });

        case "DELETE_CHART_FILTER_SELECTED_GROUP":
            return update(state, {
                tabTile: {
                    [action.payload.tabTileName]: { $splice: [[action.payload.groupIndex, 1]] }
                },
                chartFilterGroupEdited: { $set: true }
            });

        case "SORT_RIGHT_FILTER_GROUP_ITEMS":
            let dropIndex = findCardIndex(
                action.payload.groupId,
                action.payload.dropUId,

            );
            let dragObj = findCardObject(
                action.payload.groupId,
                action.payload.dragUId
            );

            return update(state, {
                groups: {
                    [action.payload.groupId]: {
                        filters: {
                            $splice: [
                                [dragObj.cardIndex, 1],
                                [dropIndex, 0, dragObj.card],
                            ],
                        },
                    },
                },
            });

        case "REVERT_RIGHT_FILTER_GROUP_ITEMS":
            let dragObj2 = findCardObject(
                action.payload.groupId,
                action.payload.uId,
            );
            return update(state, {
                groups: {
                    [action.payload.groupId]: {
                        filters: {
                            $splice: [
                                [dragObj2.cardIndex, 1],
                                [action.payload.originalIndex, 0, dragObj2.card],
                            ],
                        },
                    },
                },
            });



        default:
            return state;
    }
};

export default chartFilterGroupReducer;