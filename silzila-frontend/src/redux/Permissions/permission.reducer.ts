import { IPermission, TAction } from "./types"

const initailPermissionState={
    workspaces:[] as IPermission[],
    workspaceContents:[] as IPermission[],
    SubWorkspaceContents:[] as IPermission[],
}
type TPermissionState = typeof initailPermissionState;
const permissionReducer = (state:TPermissionState = initailPermissionState, action:TAction):TPermissionState => {
    switch (action.type) {
        case "SET_WORKSPACES":
            return {
                ...state,
                workspaces: action.payload
            }
        case "SET_WORKSPACE_CONTENTS":
            return {
                ...state,
                workspaceContents: action.payload
            }
        case "SET_SUB_WORKSPACE_CONTENTS":
            return {
                ...state,
                SubWorkspaceContents: action.payload
            }
        case "RESET":
            return initailPermissionState;
        default:
            return state;
    }
}
export default permissionReducer;