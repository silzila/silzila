import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import DataHome from "./DataConnection/DataHome";
import Login from "./LoginSignUp/Login";
import SignUp from "./LoginSignUp/SignUp";
import NewDataSet from "./DataSet/NewDataSet";
import EditDataSet from "./DataSet/EditDataSet";
import { isLoggedProps, LoggedDetailsType } from "../redux/UserInfo/IsLoggedInterfaces";
import DataViewer from "./DataViewer/DataViewer";
import EditFlatFileData from "./DataConnection/EditFlatFileData";
import FlatFileUpload from "./DataConnection/FlatFileUpload";
import NewDataConnection from "./DataConnection/NewDataConnection";
// import { Item } from "../redux/UserInfo/types";
// import Redirect from "./Redirect";

const Home = (props: LoggedDetailsType) => {
	return (
		// TODO: Priority 10 - Capture Browser's navigation clicks
		// Pressing back or forward in browser navigation brings to different Pages.
		// If the required data is not there in the Pages, they crash
		// Eg. After going to create / edit Dataset page, come back to dataHome
		// then again click forward to go to editDataset page

		<React.Fragment>
			{props.isUserLogged ? (
				<Router>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/newdataset" element={<NewDataSet />} />
						<Route path="/editdataset" element={<EditDataSet />} />
						<Route path="/datahome" element={<DataHome />} />
						<Route path="/dataviewer" element={<DataViewer />} />
						<Route path="/flatfileupload" element={<FlatFileUpload />} />
						<Route path="/editflatfile" element={<EditFlatFileData />} />
						<Route path="/newdataconnection" element={<NewDataConnection />} />
					</Routes>
				</Router>
			) : (
				<Router>
					<Routes>
						{/* <Route path="*" element={<Redirect />} /> */}
						<Route path="/" element={<Login />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<SignUp />} />
					</Routes>
				</Router>
			)}
		</React.Fragment>
	);
};
const mapStateToProps = (state: isLoggedProps, ownProps: any) => {
	return {
		isUserLogged: state.isLogged.isUserLogged,
	};
};

export default connect(mapStateToProps, null)(Home);
