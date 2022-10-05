// This is a Redirect page displayed when user navigates to any route other than '/' while logged out

import React from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
	const navigate = useNavigate();
	return (
		<div
			style={{
				height: "100vh",
				width: "100vw",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<pre style={{ fontFamily: "Segoe", lineHeight: "2rem" }}>
				You don't have access to this page. {"\n"} Please{" "}
				<span
					style={{ textDecoration: "underline", cursor: "pointer" }}
					onClick={() => {
						navigate("/login");
					}}
				>
					login
				</span>{" "}
				to continue
			</pre>
		</div>
	);
};

export default Redirect;
