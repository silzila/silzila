import { IPermission, TAction } from "./types"
export const setWorkspaces=(workspaces:IPermission[]):TAction=>{
    return {
        type:"SET_WORKSPACES",
        payload:workspaces
    }
}
export const setWorkspaceContents=(workspaceContents:IPermission[]):TAction=>{
    return {
        type:"SET_WORKSPACE_CONTENTS",
        payload:workspaceContents
    }
}
export const setSubWorkspaceContents=(SubWorkspaceContents:IPermission[]):TAction=>{
    return {
        type:"SET_SUB_WORKSPACE_CONTENTS",
        payload:SubWorkspaceContents
    }
}
export const reset=():TAction=>{
    return {
        type:"RESET",
        payload:[]
    }
}