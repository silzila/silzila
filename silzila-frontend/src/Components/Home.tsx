import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import necessary components from react-router-dom
import { Navigate } from "react-router-dom"; // Import Navigate component

// Import your components
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
import Workspace from "../pages/Workspace";
import SubWork from "../pages/SubWork";
import SubWorkDetails from "../pages/SubWorkDetails";
import UserProf from "../pages/UserProf";

const Home = (props: LoggedDetailsType) => {
  return (
    <Router>
      <Routes>
        {/* Routes accessible only when user is logged in */}
        {props.isUserLogged ? (
          <>
            <Route path="/newdataset/:parentId" element={<NewDataSet />} />
            <Route path="/editdataset/:parentId" element={<EditDataSet />} />
            {/* <Route path="/datahome" element={<DataHome />} /> */}
            <Route path="/dataviewer/:parentId" element={<DataViewer />} />
            <Route path="/flatfileupload/:parentId" element={<FlatFileUpload />} />
            <Route path="/editflatfile/:parentId" element={<EditFlatFileData />} />
            {/* <Route path="/newdataconnection" element={<NewDataConnection />} /> */}
            <Route path="/workspace" element={<Workspace />} />
            <Route path= "/workspace/:parentId" element= {<SubWork />} />
            <Route path= "/SubWorkspaceDetails/:parentId" element= {<SubWorkDetails />} />
            <Route path= "/newdataconnection/:parentId" element= {<NewDataConnection />} />
            <Route path= "/SubWorkspaceDetails/:parentId" element= {<SubWorkDetails />} />
            <Route path= "/update-profile" element= {<UserProf /> } />
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
