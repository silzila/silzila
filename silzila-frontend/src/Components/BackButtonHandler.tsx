import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetAllStates } from "../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { connect } from "react-redux";
import { Dispatch } from "redux";


const BackButtonHandler = (props:any) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButtonClick = (event:any) => {
      event.preventDefault(); // Prevent the default back navigation
      console.log("Back button pressed!");

      // Optionally, navigate to a custom route or show a confirmation dialog
      // Example: navigate("/custom-route");
      props.resetAllStates();

      window.removeEventListener("popstate", handleBackButtonClick);
    };

    // Listen for popstate events (browser back/forward button)
    window.addEventListener("popstate", handleBackButtonClick);

    return () => {
      // Clean up the event listener when the component unmounts
      //window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		resetAllStates: () => dispatch(resetAllStates()),
	
	};
};

export default connect(null, mapDispatchToProps)(BackButtonHandler);

