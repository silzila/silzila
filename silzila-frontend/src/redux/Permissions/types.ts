export type TRole='account_admin'|'owner'|'admin'|'moderator'|'creator'|'custom_creator'|'player';
export type TCustomPermission={
    contentTypeId:number;
    privilegeId:number;
}
export interface IPermission{
    id: string;
    name: string;
    contentType: number;
    createdAt: string;
    createdBy: string;
    levelId: number;
    parentWorkspaceId: string;
    parentWorkspaceName: string;
    roleId: number;
    roleName: TRole;
    updatedAt: string;
    updatedBy: string | null;
    customPermissions?:TCustomPermission[];
}
export type TActionType = "SET_WORKSPACES" | "SET_WORKSPACE_CONTENTS" | "SET_SUB_WORKSPACE_CONTENTS"|'RESET'
export type TAction={
    type:TActionType,
    payload:IPermission[]
}