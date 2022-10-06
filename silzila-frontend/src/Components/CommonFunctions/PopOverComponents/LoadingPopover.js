// Loading spinner used in many components
// used mainly during wait times when there are server interactions

import React from "react";

const LoadingPopover = () => {
	return (
		<div className="loaderContainer">
			<div className="loader"></div>
		</div>
	);
};

export default LoadingPopover;
