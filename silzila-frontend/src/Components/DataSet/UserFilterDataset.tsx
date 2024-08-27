//this component is used for datasetFilter coulmn in Right side of canvas table

import { connect } from "react-redux";
import { UserFilterDatasetProps } from "./UserFilterDatasetInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { DataSetStateProps } from "../../redux/DataSet/DatasetStateInterfaces";
import FilterElement from "./FilterElement";

const UserFilterDataset = ({
  //props
  editMode,
  dataSetFilterArray,

  dbConnectionId,

  setDataSetFilterArray,
}: UserFilterDatasetProps) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", marginTop: "25px" }}
    >
      {dataSetFilterArray.length > 0 &&
        dataSetFilterArray.map((item) => (
          <FilterElement
            filterDatasetItem={item}
            dbConnectionId={dbConnectionId}
            editMode={editMode}
            setDataSetFilterArray={setDataSetFilterArray}
          />
        ))}
    </div>
  );
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
  return {
    token: state.isLogged.accessToken,
    schema: state.dataSetState.schema,
    dbName: state.dataSetState.databaseName,
    datasetName: state.dataSetState.datasetName,
  };
};

export default connect(mapStateToProps, null)(UserFilterDataset);
