// Components of Create Dataset page

import React from "react";
import MenuBar from "../DataViewer/MenuBar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

const NewDataSet = () => {
	return (
		<div className="dataHome">
			<MenuBar from="dataSet" />
			<div className="createDatasetPage">
				<Sidebar />
				<Canvas />
			</div>
		</div>
	);
};

export default NewDataSet;
