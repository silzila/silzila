// Components of Create Dataset page

import MenuBar from "../DataViewer/MenuBar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import FetchData from "../ServerCall/FetchData";


import {
	setConnectionValue,
	setServerName,
	setDatabaseNametoState,
	setDataSchema,
	setUserTable,
	setViews,
  } from "../../redux/DataSet/datasetActions";


import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
  ConnectionItem,
  DataSetStateProps,
  tableObjProps,
  UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";

import { useLocation, useNavigate } from "react-router-dom";
import { resetState, setTempTables, setCreateDsFromFlatFile } from "../../redux/DataSet/datasetActions";


const NewDataSet = ({
	dsId,
	token,
  
	// state
	
	  // dispatch
	  resetState,
	  setTempTables,
	  setConnection,
	  setDataSchema,
	  setUserTable,
	  setServerName,
	  setDatabaseNametoState,
	  setViews,
	  setCreateDsFromFlatFile
}:any) => {
	const [loading, setLoading] = React.useState(false);
	const location = useLocation();
    const state	= location.state;
	const navigate = useNavigate();

	useEffect(()=>{
		if(!state){
			navigate("/")
		}
		if(state && state?.mode === "New"){      
			setConnection("");            
			setServerName("");
			resetState();
			setDataSchema("");
			setUserTable([]);
			setViews([]);
			setTempTables([]);
			console.log(" getAllDataConnections();")
			
			if(state && state?.isFlatFile){
				setCreateDsFromFlatFile(true);
				setFlatFilesListAsTables();
			}
		}
	},[state])
	if (!state) {
	  return null;
	}
	

	  
  const setFlatFilesListAsTables = async () => {
	setLoading(true);
    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `file-data?workspaceId=${state?.parentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status) {
      const aliasMap: { [key: string]: string } = {};
      const aliasCount: { [key: string]: number } = {};
      const userTable: UserTableProps[] = res.data.map((el: any) => {
        function generateTableId(table:string) {
          let alias = '';
          const words = table.replace(/[-_]/g, ' ').split(' ');
          if (words.length === 1) {
              alias = words[0][0].toLowerCase();
          } else {
              alias = words.map(word => word[0].toLowerCase()).join('');
          }
          if (aliasMap[alias]) {
              if (!aliasCount[alias]) aliasCount[alias] = 1; // Initialize the counter
              aliasCount[alias]++;
              alias = alias + aliasCount[alias]; // Append number suffix for uniqueness
          }
          aliasMap[alias] = table;
      
          return alias;
      }
        return {
          schema: "",
          database: "",
          tableName: el.name,
          isSelected: false,
          table_uid: el.id,
          // id: uid(),
          id: generateTableId(el.name),
          isNewTable: true,
          isCustomQuery: false,
          customQuery:""
        };
      });
      setUserTable(userTable);
	  setLoading(false);
    } else {
		setLoading(false);			
    }
  };


	return (
		<>
		{
			dsId === "" && 
			<div className="dataHome">
			<MenuBar from="dataSet" />
			<div className="createDatasetPage" style={{ height:'calc(100svh - 2.5rem)' }}>
				<Sidebar _loading={loading} _id='sidebar-from-newdataset-create'/>
				<Canvas />
			</div>
		</div>
		}
		</>
	);
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
	return {
	  dsId: state.dataSetState.dsId,	 
	  token: state.isLogged.accessToken,
	};
  };

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
	  setConnection: (connection: string) =>
		dispatch(setConnectionValue(connection)),
	  setDataSchema: (schema: string) => dispatch(setDataSchema(schema)),
	  setUserTable: (userTable: UserTableProps[]) =>
		dispatch(setUserTable(userTable)),
	  setServerName: (name: string) => dispatch(setServerName(name)),
	  setDatabaseNametoState: (name: string) =>
		dispatch(setDatabaseNametoState(name)),
	  setViews: (views: any[]) => dispatch(setViews(views)),
	  resetState: () => dispatch(resetState()),
	  setTempTables: (table: tableObjProps[]) => dispatch(setTempTables(table)),
	   setCreateDsFromFlatFile: (value: boolean) =>
      dispatch(setCreateDsFromFlatFile(value)),
	};
  };

export default connect(mapStateToProps, mapDispatchToProps)(NewDataSet);
