import { Table } from "@mui/material";
import DataConnection from "../DataConnection/DataConnection";

export type TRole =
  | "account_admin"
  | "owner"
  | "admin"
  | "moderator"
  | "creator"
  | "custom_creator"
  | "player";
export const fromRoute={
  dataViewer:'dataViewer',

}
export const navigatetTo={
  home:'home',
  login:'login',
  updateProfile:'updateProfile',
}
export const AxisType={
  Row:'Row',
  Column:'Column',
  Measure:'Measure',
  Dimension:'Dimension',
  X:'X Axis',
  Y:'Y Axis',
  ChartFilter:'Filter'

}
export const roles = {
  AccountAdmin: "account_admin",
  Admin: "admin",
  Owner: "owner",
  Moderator: "moderator",
  Creator: "creator",
  CustomCreator: "custom_creator",
  Player: "player",
  Community: "community",
};
export const roleIds = {
  AccountAdmin: 1,
  Admin: 2,
  Owner: 3,
  Moderator: 4,
  Creator: 5,
  CustomCreator: 6,
  Player: 7,
  Community: 8,
};

export const permissions = {
  create: 1,
  edit: 2,
  view: 3,
  noPermission: null,
  restricted:0
};
export const contentTypes = {
  Dataset: 3,
  DatConnection: 2,
  FlatFile: 4,
  Playbook: 5,
  Workspace: 1,
};
export const messages = {
  dataset: {
    wrongName:
      "Dataset name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( ).",
    tableWrongName: 
      "Table name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( )."
  },
  dataConnection: {
    wrongName:
      "DB Connection name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( ).",
  },
  flatfile: {
    wrongName:
      "Flatfile name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( ).",
  },
  playbook: {
    wrongName:
      "Playbook name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( ).",
      WindowFunctionRemoved:"Window functions are removed as dimensions are changed.",
  },
  workspace: {
    wrongName:
      "File name cannot be empty and must not contain special characters except underscores (_), hyphens (-), and spaces ( ).",
  },
};

export const DragFrom={
  TABLE:99
}
export const DropTo={
  MEASURE:'Measure',
  DIMENSION:'Dimension',
  CHART_FILTER:'Filter',
  X:'X Axis',
  Y:'Y Axis',
  ROW:'Row',
  COLUMN:'Column',
}
export const Area={
  MEASURE:"Measure",
  CHART_FILTER:"Filter",
  TABLE:"Table",
}