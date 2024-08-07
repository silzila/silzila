export interface UserFilterDatasetProps {
  //props
  tableId: any;
  editMode?: boolean;
  tableName: any;
  displayName: any;
  dataType: string;
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
  tableId: string;
  displayName: string;
  dataType: string;
  uid: any;
}
