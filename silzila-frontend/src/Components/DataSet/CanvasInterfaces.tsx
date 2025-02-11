import {
  ArrowsProps,
  tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { IFlatIdTableIdMap } from "./EditDataSetInterfaces";

export interface CanvasProps {
  //state
  tempTable: tableObjProps[];
  dataSetState?: any;
  arrows: ArrowsProps[];
  dsId?: string;
  //props
  editMode?: boolean;
  flatFileIdMap:IFlatIdTableIdMap[];
  EditFilterdatasetArray: any[];
}

export interface ArrowObj {
  isSelected: boolean;

  startTableName: string;
  startColumnName: string;
  start: string;
  table1_uid: string;
  startSchema: string;
  startId: string;

  endTableName: string;
  endColumnName: string;
  end: string;
  table2_uid: string;
  endSchema: string;
  endId: string;
}
export interface newArrowObj {
  cardinality?: string;
  end: string;
  endColumnName: string;

  endId: string;
  endSchema: string;
  endTableName: string;
  integrity?: string;
  isSelected: boolean;
  relationId: string;
  showHead?: boolean;
  showTail?: boolean;
  start: string;
  startColumnName: string;
  startId: string;
  startSchema: string;
  startTableName: string;
  table1_uid: string;
  table2_uid: string;
}
