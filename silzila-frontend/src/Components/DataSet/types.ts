import { TRole } from "../CommonFunctions/aliases";

export type TLocationStateEditDS = {
  mode: "Edit" | "New";
  parentId: string;
  workspaceName: string;
  dsId: string;
};
export type TLocationStateCreateDS = {
  mode: "Edit" | "New";
  parentId: string;
  workspaceName: string;
  isFlatFile: boolean;
};
export type TContentDetails = {
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
};

export type TLocationStateDS = TLocationStateEditDS | TLocationStateCreateDS;