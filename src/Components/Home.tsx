import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

const Home = (props: LoggedDetailsType) => {
  return (
    <Router>
      <Routes>
        {/* Routes accessible only when user is logged in */}
        {props.isUserLogged ? (
          <>
            <Route path="/newdataset" element={<NewDataSet />} />
            <Route path="/editdataset" element={<EditDataSet />} />
            <Route path="/datahome" element={<DataHome />} />
            <Route path="/dataviewer" element={<DataViewer />} />
            <Route path="/flatfileupload" element={<FlatFileUpload />} />
            <Route path="/editflatfile" element={<EditFlatFileData />} />
            <Route path="/newdataconnection" element={<NewDataConnection />} />
          </>
        ) : (
          // Redirect to login if user is not logged in
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
        {/* Routes accessible whether user is logged in or not */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

const mapStateToProps = (state: isLoggedProps, ownProps: any) => {
  return {
    isUserLogged: state.isLogged.isUserLogged,
  };
};

export default connect(mapStateToProps, null)(Home);
