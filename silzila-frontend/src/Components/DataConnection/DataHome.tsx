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
import FlatFile from "./FlatFile";

const DataHome = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateRows: "2.5rem auto",
				height: "100vh",
			}}
		>
			<MenuBar from="dataHome" />
			<div
				style={{
					borderTop: "2px solid rgba(224,224,224,1)",
					display: "grid",
					gridTemplateColumns: "50% 50%",
					gridTemplateRows: "50% 50%",
				}}
			>
				<div
					style={{
						borderRight: "2px solid rgba(224,224,224,1)",
						borderBottom: "2px solid  rgba(224,224,224,1)",
					}}
				>
					<DataConnection />
				</div>
				<div
					style={{
						borderBottom: "2px solid  rgba(224,224,224,1)",
						paddingBottom: "1rem",
					}}
				>
					<DataSetList />
				</div>
				<div style={{ borderRight: "2px solid  rgba(224,224,224,1)" }}>
					<FlatFile />
				</div>
				<div>
					<PlayBookList />
				</div>
			</div>
		</div>
		// <div className="dataHome">
		// 	<MenuBar from="dataHome" />
		// 	<div className="dataSetup">
		// 		<div className="dcds">
		// 			<DataConnection />
		// 			<DataSetList />
		// 		</div>
		// 		<PlayBookList />
		// 	</div>
		// </div>
	);
};

export default DataHome;
