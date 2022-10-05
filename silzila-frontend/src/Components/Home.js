import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import Redirect from "./Redirect";

const Home = (props) => {
	return (
    // TODO: Priority 10 - Capture Browser's navigation clicks
    // Pressing back or forward in browser navigation brings to different Pages.
    // If the required data is not there in the Pages, they crash
    // Eg. After going to create / edit Dataset page, come back to dataHome
    // then again click forward to go to editDataset page

    <React.Fragment>
      <Router>
        <Routes>
          <Route path="*" element={<Redirect />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
	return {
		isUserLogged: state.isLogged.isUserLogged,
	};
};

export default connect(mapStateToProps, null)(Home);
