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
