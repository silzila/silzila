export interface UserFilterDatasetProps {
  //props
  tableId: any;
  editMode?: boolean;
  tableName: any;
  displayName: any;
  dataType: string;
  field: any;
  uid: any;
  dbConnectionId: any;
  dataSetFilterArray: dataSetFilterArrayProps[];
  setDataSetFilterArray: React.Dispatch<
    React.SetStateAction<dataSetFilterArrayProps[]>
  >;

  //state
  dbName: string;

  token: string;
  schema: string;
  datasetName: string;
}

export interface dataSetFilterArrayProps {
  exprType: string;
  fieldName: string;
  fieldtypeoption: string;
  includeexclude: string;
  isCollapsed: true;
  tableId: string;
  displayName: string;
  dataType: string;
  uid: any;
  filterOptions: string;
}
