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
		<div
			style={{
				display: "grid",
				gridTemplateRows: "2.5rem auto",
				height: "100vh",
				width: "100vW",
			}}
		>
			<div>
				<MenuBar from="dataHome" />
			</div>
			<div
				style={{
					flex: "100%",
					display: "flex",
					flexDirection: "column",
					height: "100%",
					backgroundColor: "pink",
					borderTop: "2px solid rgba(224,224,224,1)",
				}}
			>
				<div style={{ flex: 1, display: "flex" }}>
					<div
						style={{
							flex: 1,
							borderRight: "2px solid rgba(224,224,224,1)",
							borderBottom: "2px solid  rgba(224,224,224,1)",
						}}
					>
						<DataConnection />
					</div>
					<div style={{ flex: 1, borderBottom: "2px solid  rgba(224,224,224,1)" }}>
						<DataSetList />
					</div>
				</div>
				<div style={{ flex: 1, display: "flex", maxHeight: "100%", overflow: "hidden" }}>
					<div style={{ flex: 1, borderRight: "2px solid  rgba(224,224,224,1)" }}>
						<FlatFile />
					</div>
					<div style={{ flex: 1 }}>
						<PlayBookList />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataHome;



 