import React from "react";
import { connect, } from "react-redux";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";

// Import your components
import Login from "./LoginSignUp/Login";
import SignUp from "./LoginSignUp/SignUp";
import NewDataSet from "./DataSet/NewDataSet";
import EditDataSet from "./DataSet/EditDataSet";
import DataViewer from "./DataViewer/DataViewer";
import EditFlatFileData from "./DataConnection/EditFlatFileData";
import FlatFileUpload from "./DataConnection/FlatFileUpload";
import NewDataConnection from "./DataConnection/NewDataConnection";
import Workspace from "../pages/Workspace";
import SubWork from "../pages/SubWork";
import SubWorkDetails from "../pages/SubWorkDetails";
import UserProf from "../pages/UserProf";
import { isLoggedProps, LoggedDetailsType } from "../redux/UserInfo/IsLoggedInterfaces";


const Home = (props: LoggedDetailsType) => {

  const isUserLogged = props.isUserLogged

  return (
    <Router>
    <Routes>
      {isUserLogged ? (
        <>
          <Route path="/newdataset/:parentId" element={<NewDataSet />} />
          <Route path="/editdataset/:parentId" element={<EditDataSet />} />
          <Route path="/dataviewer/:parentId" element={<DataViewer />} />
          <Route path="/flatfileupload/:parentId" element={<FlatFileUpload />} />
          <Route path="/editflatfile/:parentId" element={<EditFlatFileData />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/" element={<Navigate to="/workspace" />} />
          <Route path="/workspace/:parentId" element={<SubWork />} />
          <Route path="/SubWorkspaceDetails/:parentId" element={<SubWorkDetails />} />
          <Route path="/newdataconnection/:parentId" element={<NewDataConnection />} />
          <Route path="/update-profile" element={<UserProf />} />
          <Route path="/*" element={<Navigate to="/workspace" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </>
      )}
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