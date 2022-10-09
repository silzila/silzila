import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import DataHome from "./DataConnection/DataHome";
import EditDataSet from "./DataSet/EditDataSet";
import NewDataSet from "./DataSet/NewDataSet";
import DataViewer from "./DataViewer/DataViewer";

import Login from "./LoginSignUp/Login";
import SignUp from "./LoginSignUp/SignUp";
import Redirect from "./Redirect";

const Home = (props) => {
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
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />

            <Route exact path="/datahome" element={<DataHome />} />
						<Route exact path="/newdataset" element={<NewDataSet />} />
						<Route exact path="/editdataset" element={<EditDataSet />} />
						<Route exact path="/dataviewer" element={<DataViewer />} />
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="*" element={<Redirect />} />
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
	return {
		isUserLogged: state.isLogged.isUserLogged,
	};
};

export default connect(mapStateToProps, null)(Home);
