// DataHome page renders the following lists
// 	- List of Data connections (Connections to database)
// 	- List of Datasets (User created subset / schema of selected tables from existing data connections)
// 	- List of Playbooks

import React from "react";
import DataSetList from "../DataSet/DataSetList";
import MenuBar from "../DataViewer/MenuBar";
import DataConnection from "./DataConnection";
import PlayBookList from "./PlayBookList";
import "./DataSetup.css";
import FlatFile from "./FlatFileList";

const DataHome = () => {
	return (
		<div className="dataHomeContainer">
		<div>
			<MenuBar from="dataHome" />
		</div>
		<div className="dataHomeItemsContainer">
			<DataConnection />
			<DataSetList />
			<FlatFile />
			<PlayBookList />
		</div>
	</div>
);
};

export default DataHome;

