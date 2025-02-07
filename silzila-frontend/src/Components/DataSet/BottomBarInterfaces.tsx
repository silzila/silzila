import {
  ArrowsProps,
  RelationshipsProps,
  tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";

export interface BottomBarProps {
  //props
  editMode: boolean;
  // state
  tempTable: tableObjProps[];
  arrows: ArrowsProps[];
  relationships: RelationshipsProps[];
  token: string;
  connection: string;
  dsId: string;
  datasetName: string;
  database: string;
  isFlatFile: boolean;
  datasetFilterArray: any[];

  // dispatch
  resetState: () => void;
}

export interface tablesSelectedInSidebarProps {
  table: string;
  schema: string;
  database: string;
  id: string;
  alias: string;
  tablePositionX: number | null;
  tablePositionY: number | null;
  flatFileId: string | null;
  isCustomQuery: boolean;
  customQuery: string;
}

export interface relationshipServerObjProps {
  table1: string;
  table2: string;
  cardinality: string;
  refIntegrity: string;
  table1Columns: string[];
  table2Columns: string[];
}

export interface IDataSetCreatePayLoad {
  connectionId: string;
  datasetName: string;
  isFlatFileData: boolean;
  dataSchema: IdataSchema;
}
export interface IdataSchema {
  tables: ITable[];
  relationships: IRelationship[];
  filterPanels: IFilterPanel[];
}
export interface ITable {
  id: string;
  flatFileId: string;
  database: string;
  schema: string;
  table: string;
  alias: string;
  tablePositionX: number;
  tablePositionY: number;
  isCustomQuery: boolean;
  customQuery: string;
}
export interface IRelationship {
  table1: string;
  table2: string;
  cardinality: string;
  refIntegrity: string;
  table1Columns: string[];
  table2Columns: string[];
}
export interface IFilterPanel {
  panelName: string;
  shouldAllConditionsMatch: boolean;
  filters: IFilter[];
}
export interface IFilter {
  filterType: string;
  tableId: string;
  uid: string;
  fieldName: string;
  dataType: string;
  shouldExclude: boolean;
  operator: string;
  tableName: string;
  timeGrain?: string;
  userSelection: string[] | number[]|Date[] ;
  relativeCondition?: IRelativeCondition | null;
  isTillDate?: boolean;
  isCalculatedField?:boolean;
  calculatedField?:any[]

}
export enum FilterDataType {
  TEXT = "text",
  INTEGER = "integer",
  DECIMAL = "decimal",
  BOOLEAN = "boolean",
  DATE = "date",
  TIMESTAMP = "timestamp",
}
export enum FilterOperator {
  IN = "in",
  EQUAL_TO = "equalTo",
  NOT_EQUAL_TO = "notEqualTo",
  CONTAINS = "contains",
  BEGINS_WITH = "beginsWith",
  ENDS_WITH = "endsWith",
  BETWEEN = "between",
  GREATER_THAN = "greaterThan",
  GREATER_THAN_OR_EQUAL_TO = "greaterThanOrEqualTo",
  LESS_THAN = "lessThan",
  LESS_THAN_OR_EQUAL_TO = "lessThanOrEqualTo",
  EXACT_MATCH = "exactMatch",
}
export enum FilterTimeGrain {
  YEAR = "year",
  QUARTER = "quarter",
  MONTH = "month",
  YEARQUARTER = "yearquarter",
  YEARMONTH = "yearmonth",
  DATE = "date",
  DAYOFMONTH = "dayofmonth",
  DAYOFWEEK = "dayofweek"
}
export interface IRelativeCondition {
  from: string[] ;
  to: string[];
  anchorDate: string ;
}
