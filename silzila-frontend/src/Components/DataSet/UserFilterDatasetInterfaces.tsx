export interface UserFilterDatasetProps {
  //props
  tableId: any;
  tableName: any;
  displayName: any;
  dataType: string;
  dbConnectionId: any;
  datasetId?: any;
  dataSetFilterArray: dataSetFilterArrayProps[];
  setDataSetFilterArray: React.Dispatch<
    React.SetStateAction<dataSetFilterArrayProps[]>
  >;

  //state
  token: string;
}

export interface dataSetFilterArrayProps {
  tableId: string;
  displayName: string;
  dataType: string;
  uid: any;
}
